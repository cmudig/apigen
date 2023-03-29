import {emitter, capitalize, decapitalize} from "./util"
import {ASTStatement} from "./internalRepresentation"
import ts from "typescript";
import * as fs from 'fs';
import { Project, Statement, SyntaxKind } from "ts-morph";

const emit = emitter('utils')

export function generateClassMemberMethod(name: string, args: string[]){
    const argString: string = args.join(', ');
    let functionText = `${name}(${argString}){}`;
    return functionText;
}

export function generateClass(statements: ASTStatement[], args: string[], obj: any){

  for (let i = 0; i < statements.length; i++){
    const statement = statements[i];
    const className = capitalize(statement.name as string);

    switch(statement.kind){
      case ts.SyntaxKind.TypeAliasDeclaration: {
        if(statement.name == "FieldDef"){
          
          break;
        }
        emit.import(['BaseObject'], '__util__');
        emit(`export class ${className} extends BaseObject{`);
        emit.indent();
        
        const argString: string = args.join(' | ');
        generateConstructor(argString);
        generateExportFunction(className, argString);  
        break;
      }
  
      case ts.SyntaxKind.InterfaceDeclaration: {
        if(statement.name == "FieldDef"){
          break;
        }

        if(statement.name == "Encoding"){
          obj.statements
        }
        break;
      }
    }
  }
}
  
export function generateConstructor(args: string){
{
    if (args.length == 0){
        emit('constructor(){')
    } 
    else{
    emit(`constructor(args:  "${args}"){`).indent();
    }
    emit('super();');
    emit('}').outdent().outdent();
    emit('}');
}
}

export function generateExportFunction(name: string, argString:string){
emit(`export function ${decapitalize(name)}(args: "${argString}"){`);
emit.indent();
emit(`return new ${capitalize(name)}(args);`);
emit.outdent();
emit('}');
}

//Write to the output file.
export function writeFile(outputFile: string){
    fs.writeFileSync(outputFile, emit.code());
  }