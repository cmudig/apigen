import * as ts from "typescript";
/**
 * Output:
    No.. Type source file not found. - TopLevelUnitSpec<Field> 
    No.. Type source file not found. - TopLevelFacetSpec 
    No.. Type source file not found. - TopLevel<LayerSpec<Field>> 
    No.. Type source file not found. - TopLevel<RepeatSpec> 
    No.. Type source file not found. - TopLevel<GenericConcatSpec<NonNormalizedSpec>> 
    No.. Type source file not found. - TopLevel<GenericVConcatSpec<NonNormalizedSpec>> 
    No.. Type source file not found. - TopLevel<GenericHConcatSpec<NonNormalizedSpec>> 
 */

// get the source file of a type alias declaration
function findTypeDeclarationSourceFile(type: ts.TypeNode, checker: ts.TypeChecker): string | undefined {
    const symbol = checker.getSymbolAtLocation(type);

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
// start from the TopLevelSpec
if (sourceFile) {
    const specNode = findTopLevelSpec(sourceFile);
    if (ts.isUnionTypeNode(specNode)) {
        // TopLevelSpec typeNodes
        const types = specNode.types;
        for(const type of types) {
            const typeSourceFile = findTypeDeclarationSourceFile(type, checker);

            if (typeSourceFile) {
                console.log(`Found! Type comes from: ${typeSourceFile}. -  ${type.getText()}`);
            } else {
                console.log(`No.. Type source file not found. - ${type.getText()} `);
            }
        }
    }
}
// util to find the TopLevelSpec
function findTopLevelSpec(sourceFile: ts.SourceFile): ts.UnionTypeNode {
    for (const statement of sourceFile.statements) {
        if (ts.isTypeAliasDeclaration(statement) && statement.name.getText() === "TopLevelSpec"){
            if(ts.isUnionTypeNode(statement.type)) {
                return statement.type;
            }  
        }
    }
    throw new Error("TopLevelSpec not found");
}
