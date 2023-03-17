//Adapted from https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
import ts from "typescript";
import * as fs from 'fs';
import { parse } from "./parser"
import { Project, SyntaxKind } from "ts-morph";
import {emitter, capitalize} from "./util"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);

//Create a file and write the first essential line.
let outputFile = "generatedVLClasses.ts"

const emit = emitter('__util__')

//TODO: replace this with a programmatic function and possibly with ts morph
let argsList: string[] = [];
let len = obj.statements[4].type.types.length
for (let i = 0; i < len; i++) {
  let string = obj.statements[4].type.types[i].literal.text;
  argsList.push(string);
}
//TODO: eventually call this function while traversing over the AST
function generateClass(name: string, kind: number, args: string[]){

  const className = capitalize(name);

  switch(kind){
    case ts.SyntaxKind.TypeAliasDeclaration: {
      emit.import(['BaseObject'], '__util__');
      emit(`class ${className} extends BaseObject{`);
      emit.indent();

      let argString = `"${args[0]}" | "${args[1]}" | "${args[2]}"`;
      generateConstructor(argString);
      generateExportFunction(name, argString);  
      break;
    }

    case ts.SyntaxKind.InterfaceDeclaration: {
      emit.import(['BaseObject'], '__util__');
      emit(`class ${className} extends BaseObject{`);
      emit.indent();
      let argString = ""
      generateConstructor(argString);
      generateExportFunction(name, argString);
      break;
    }
  }

}

function generateConstructor(args: string){
  {
    emit(`constructor(...args:  ${args})`).indent();
    emit(`super();`);

    // init data object
    emit.import(['init', 'set', 'get', 'merge'], '__util__');
    
    emit(`init(this);`);
    //TODO: understand logic for this part
    // emit(`set(this, args, args});`);

    emit('}').outdent().outdent();
    emit('}');
  }

}

function generateExportFunction(name: string, argString:string){
  emit(`export function ${name}(...args: ${argString}){`);
  emit.indent();
  emit(`return new ${capitalize(name)}(...args);`);
  emit.outdent();
  emit('}');
}

generateClass("Mark", ts.SyntaxKind.TypeAliasDeclaration, argsList);
generateClass("FieldDef", ts.SyntaxKind.InterfaceDeclaration, []);

//Write to the output file.
fs.writeFileSync(outputFile, emit.code());