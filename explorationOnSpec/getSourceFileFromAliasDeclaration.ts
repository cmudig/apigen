import * as ts from "typescript";
/**
 * Output:
 * Type alias comes from: vega-lite-src/spec/index.ts
 */


// get the source file of a type alias declaration
function findTypeDeclarationSourceFile(type: ts.TypeAliasDeclaration, checker: ts.TypeChecker): string | undefined {
    const symbol = checker.getSymbolAtLocation(type.name);

    if (symbol) {
        const declarations = symbol.getDeclarations();

        if (declarations) {
            const declaration = declarations[0];
            const sourceFile = declaration.getSourceFile();
            
            if (sourceFile) {
                return sourceFile.fileName;
            }
        }
    }

    return undefined;
}

// create a program to parse the source file
const sourceFiles = ["vega-lite-src/spec/index.ts"];
const program = ts.createProgram(sourceFiles, {});
const checker = program.getTypeChecker();
const sourceFile = program.getSourceFile("vega-lite-src/spec/index.ts");

if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isTypeAliasDeclaration(node)) {
            const typeSourceFile = findTypeDeclarationSourceFile(node, checker);
    
            if (typeSourceFile) {
                console.log(`Type alias comes from: ${typeSourceFile}`);
            } else {
                console.log("Type alias source file not found.");
            }
        }
    });
}

