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

export function generateClass(statement: ASTStatement, args: string[]){

  // for (let i = 0; i < statements.length; i++){
    // const statement = statements[i];
    const className = capitalize(statement.name as string);

    switch(statement.kind){
      case ts.SyntaxKind.TypeAliasDeclaration: {
        if(statement.name == "FieldDef"){
          
          break;
        }
        // emit.import(['BaseObject'], '__util__');
        // emit(`export class ${className} extends BaseObject{`);
        emit(`export class ${className}{`);
        emit.indent();
        
        const argString: string = args.join(' | ');
        generateConstructor(argString, className);
        generateExportFunction(className, argString);  
        break;
      }
  
      case ts.SyntaxKind.InterfaceDeclaration: {
        if(statement.name == "FieldDef"){
          break;
        }

        if(statement.name == "Encoding"){

          //use the keys of the encoding interface to create an arg string
          // argString = statement.members
          // generateConstructor(argString, className);
        }
        break;
      }
    }
  // }
}
  
export function generateConstructor(args: string, name?:string | undefined){
{
    if (args.length == 0){
        emit('constructor(){')
    } 
    else{
    emit(`constructor(private ${decapitalize(name)}:  "${args}"){`).indent();
    }
    // emit('super();');
    emit('}').outdent().outdent();
    emit('}');
}
}

export function generateExportFunction(name: string, argString:string){
emit(`export function ${decapitalize(name)}(${decapitalize(name)} : "${argString}"){`);
emit.indent();
emit(`return new ${capitalize(name)}(${decapitalize(name)});`);
emit.outdent();
emit('}');
}

//Write to the output file.
export function writeFile(outputFile: string){
    fs.writeFileSync(outputFile, emit.code());
  }