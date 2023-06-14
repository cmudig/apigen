
import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./IR";

const sourceFiles = ["SourceFiles/SourceVLType.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();


export function generateNewStatements(file: string): ASTStatement[] {
    let Statements: ASTStatement[] = [];
    const source = fs.readFileSync(file, 'utf-8');
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  
    ts.forEachChild(sourceFile, visit);
  
    // visit each node in the sourceFile
    function visit(node: ts.Node) {
        if(ts.isInterfaceDeclaration(node)){
            Statements.push(createNewInterfaceStatement(node));
        }
        if(ts.isTypeAliasDeclaration(node)){
            Statements.push(createNewTypeStatement(node));
        }
        ts.forEachChild(node, visit);
    }
  
    return Statements;
}
  
function createNewInterfaceStatement(node: ts.Node): ASTStatement {
    if(ts.isInterfaceDeclaration(node)){
        let symbol = checker.getSymbolAtLocation(node.name);
        let name = node.name.text;
        let children: string[] = [];
        const members: Record<string, string> = {};
        node.members.forEach((member) => {
            if(ts.isPropertySignature(member)){
                let memberName: string = `${member.name?.getText()}${member.questionToken? "?" : ""}`;
                let memberType: string = member.type? member.type.getText() : "undefined";
                if (member.type?.kind == ts.SyntaxKind.TypeReference){
                    // TODO: add children if the type is a type reference, may use typechecker.
                    children.push(member.type.getText());
                }     
                members[memberName] = memberType;
            }
        });
        return new ASTStatement(name, 261, undefined, members, undefined, children);
    } else {
      throw new Error("Node is not an interface declaration");
    }
}
  
function createNewTypeStatement(node: ts.Node): ASTStatement {
    if(ts.isTypeAliasDeclaration(node)){
        let name = node.name.text;
        let children: string[] = [];
        const members: Record<string, string> = {};
        if(ts.isTypeLiteralNode(node.type)){
            node.type.members.forEach((member) => {
                if(ts.isPropertySignature(member)){
                    let memberName: string = `${member.name?.getText()}${member.questionToken? "?" : ""}`;
                    let memberType: string = member.type? member.type.getText() : "undefined";
                    members[memberName] = memberType;
                }
                if (member.kind == ts.SyntaxKind.TypeReference){
                    // TODO: add children if the type is a type reference, may use typechecker.
                    children.push(member.getText());
                } 
            });
        } else if (ts.isTypeNode(node.type)){
            members[name] = node.type.getText();
            if(node.type.kind == ts.SyntaxKind.TypeReference){
                children.push(node.type.getText());
            }
        }
        // TODO: judge if it is a generic interface
        if (name === "ValueDef") {
            return new ASTStatement(name, 261, undefined, members, undefined, children, true);
        }
        return new ASTStatement(name, 262, undefined, members, undefined, children);
    } else {
        throw new Error("Node is not an interface declaration");
    }
}