import * as ts from "typescript";

const sourceFiles = ["input.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("input.ts")!;

var statementNameIndexMap = new Map<string, number>();
var statementIndex = 0;

for (const statement of sourceFile.statements) {
    if(ts.isInterfaceDeclaration(statement)) {
        console.log("###", statement.name.text, statement.kind);
        statementNameIndexMap.set(statement.name.text, statementIndex++);
        const interfaceDec = statement as ts.InterfaceDeclaration;
        const interfaceType = checker.getTypeAtLocation(interfaceDec.name);
        for (const prop of interfaceType.getProperties()) {
            const name = prop.getName();
            const type = checker.getTypeOfSymbolAtLocation(prop, interfaceDec.name);
            console.log(name, checker.typeToString(type));
        }
    } else if(ts.isTypeAliasDeclaration(statement)) {
        console.log("###", statement.name.text, statement.kind);
        statementNameIndexMap.set(statement.name.text, statementIndex++);

        const mappingDec = statement as ts.TypeAliasDeclaration;
        const mappingType = checker.getTypeAtLocation(mappingDec.name);

        // console.log(ts.isUnionTypeNode(mappingDec.type));
        if (ts.isUnionTypeNode(mappingDec.type)) {
            console.log(mappingDec.name.text);
            for (const typeNode of mappingDec.type.types) {
                console.log(typeNode.getText(), typeNode.kind);
            }
        } else {
            for (const prop of mappingType.getProperties()) {
                const name = prop.getName();
                const type = checker.getTypeOfSymbolAtLocation(prop, mappingDec.name);
                console.log(name, checker.typeToString(type));
            }
        }
    }
}

