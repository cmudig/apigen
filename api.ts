import ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./internalRepresentation"
import { emitter, capitalize, decapitalize } from "./util"
import { generateConstructor, generateExportFunction, generateClassMemberMethod, generateClass } from "./generate";

const emit = emitter('utils')

export function generateVLAPI(statement: ASTStatement) {

    const className = capitalize(statement.name as string);
  
    switch (statement.kind) {
      case ts.SyntaxKind.TypeAliasDeclaration: {
        if (statement.name == "FieldDef") {
          break;
        }
        let argName = "";
        if (statement.type == ts.SyntaxKind.UnionType){
            argName = "type";
        }
        else{
            argName = decapitalize(className);
        }
        //prepare constructor argument string
        let argString: string = "";
        if (statement.args != undefined) {
          argString = statement.args.join('" | "');
          argString = `${argName}: "${argString}"`;
        }
        if (statement.name == "Spec"){
        //    argString = statement.members.join("private ");
           argString =  "mark: Mark";
        }
        emit(generateClass(className, argString, []));
        emit(generateExportFunction(className, argString));
        break;
      }
  
      case ts.SyntaxKind.InterfaceDeclaration: {
        if (statement.name == "FieldDef") {
          break;
        }
  
        if (statement.name == "Encoding") { 
          //use the keys of the encoding interface to create an arg string
        }
        break;
      }
    }
  }

export function generatetoSpec(){
    emit(`export function toSpec(obj: any){
      return JSON.stringify(obj);
    }`);
}

  //Write to the output file.
export function writeFile(outputFile: string) {
    fs.writeFileSync(outputFile, emit.code());
  }