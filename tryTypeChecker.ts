import * as ts from "typescript";
import * as fs from "fs";

interface DocEntry {
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: DocEntry[];
    parameters?: DocEntry[];
    returnType?: string;
}

const fileNames = process.argv.slice(2);
// const fileNames:string[] = "SourceFiles/SourceVLType.ts";
let program = ts.createProgram(fileNames, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();
let output: DocEntry[] = [];

// Visit every sourceFile in the program
for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
}

fs.writeFileSync("output.json", JSON.stringify(output, undefined, 4));

/** visit nodes finding exported classes */
function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.name) {
        // This is a top level class, get its symbol
        let symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
            console.log(serializeClass(symbol));
        }
        // No need to walk any further, class expressions/inner declarations
        // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
        // This is a namespace, visit its children
        ts.forEachChild(node, visit);
    }
}

/** Serialize a symbol into a json object */
function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      )
    };
}

/** Serialize a signature (call or construct) */
function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
    };
}

/** Serialize a class symbol information */
function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
}