import * as ts from "typescript";

// create typechecker
const sourceFiles = ["SourceFiles/SourceVLType.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();
// visit every sourceFile in the program
for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
        ts.forEachChild(sourceFile, visit);
    }
}

// visit each node in the sourceFile
function visit(node: ts.Node) {
    if(ts.isInterfaceDeclaration(node)){
        interfaceGeneration(node);
    }
    if(ts.isTypeAliasDeclaration(node)){
        typeGeneration(node);
    }
    ts.forEachChild(node, visit);
}
specGeneration();

// generate class for interface
function interfaceGeneration(node: ts.Node) {
    if(ts.isInterfaceDeclaration(node)){
        let symbol = checker.getSymbolAtLocation(node.name);

        // class
        const argList:string[] = getArgs(node.members);
        const args = argList[0];
        console.log(`class ${node.name.text} {\n\tconstructor(${args}) {}\n}\n`);

        // method
        if (node.name.text == "Encoding"){
            // const methodName = node.name.text.toLowerCase();
            const methodName = "encode";
            const methodArgs = argList[1];
            const passArgs = argList[2];
            console.log(`export function ${methodName}(${methodArgs}){\n\treturn new ${node.name.text}(${passArgs});\n}\n`);
            // each member's class and export function
            node.members.forEach(member => {
                if(ts.isPropertySignature(member)){
                    const propertyName = member.name as ts.Identifier;
                    const className = propertyName.text.charAt(0).toUpperCase()+propertyName.text.slice(1);
                    const optionalMarker = member.questionToken ? '?' : '';
                    const type = member.type?.getText();
                    console.log(`class ${className} {\n\tconstructor(private type${optionalMarker}: ${type}) {}\n}\n`);
                    console.log(`export function ${propertyName.text}(type${optionalMarker}: ${type}){\n\treturn new ${className}(type);\n}\n`);
                }
            });
        }
    }
}

// generate class for type
function typeGeneration(node: ts.Node) {
    if(ts.isTypeAliasDeclaration(node)){
        if(ts.isTypeLiteralNode(node.type)){
            const members = node.type.members;
            const argList:string[] = getArgs(members);
            const args = argList[0];
            const methodArgs = argList[1];
            const passArgs = argList[2];
            var parameter = "";
            node.forEachChild(child => {
                if (ts.isTypeParameterDeclaration(child)){
                    parameter = ` <${child.name.text}> `;
                }
            });
            console.log(`class ${node.name.text}${parameter} {\n\tconstructor(${args}) {}\n}\n`);
            if (node.name.text === "Sepc"){
                console.log(`export function spec(${methodArgs}){\n\treturn new ${node.name.text}(${passArgs});\n}\n`);
            }
        } else if (ts.isTypeNode(node.type)){
            console.log(`class ${node.name.text} {\n\tconstructor(type: ${node.type.getText()}) {}\n}\n`);
        }
    }
}

// generate toSpec() and toJSON()
function specGeneration(){
    console.log(`export function toSpec(obj: any){
        return obj;
    }

    export function toJSON(obj: any){
        return JSON.stringify(obj);
    }`)
}

// get arguments from the node members
function getArgs(members: ts.NodeArray<ts.TypeElement>): string[] {
    const constructorArgs = members.map(member => {
        if(ts.isPropertySignature(member)){
            const propertyName = member.name?.getText();
            const optionalMarker = member.questionToken ? '?' : '';
            return `private ${propertyName}${optionalMarker}: ${member.type?.getText()}`;
        }
    }).join(', ');
    const methodArgs = constructorArgs.replace(/private /g, '');
    const passArgs = members.map(member => {
        if(ts.isPropertySignature(member)){
            const propertyName = member.name?.getText();
            return `${propertyName}`;
        }
    }).join(', ');        
    return [constructorArgs, methodArgs, passArgs];
}
