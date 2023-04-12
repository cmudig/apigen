import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./internalRepresentation"
import { emitter, capitalize, decapitalize } from "./util"
import { generateExportFunction, generateClass, MethodArg, createArgString } from "./generate";
const emit = emitter('')
let fieldDefArgs: MethodArg[] = [];
let primitiveArgs: MethodArg = {name: "", type:""};
export function generateVLAPI(statement: ASTStatement) {

  const className = capitalize(statement.name as string);

  switch (statement.kind) {
    case ts.SyntaxKind.TypeAliasDeclaration: {
      let argString: MethodArg[] = [];

      if (statement.name == "PrimitiveMark") {
        
        //prepare constructor argument string
        if (statement.args != undefined) {
          primitiveArgs = { keyword: "private", name: "type", type: `"${statement.args.join('" | "')}"` };
        }
        break;
      }

      if (statement.name == "Mark") {
        argString = [{keyword: "private", name: "type", type: `${primitiveArgs.type} | { type: ${primitiveArgs.type}}`}];
      }

      if (statement.name == "ColorDef") {
        
        break;
      }

      if (statement.name == "PositionDef") {
        break;
      }

      if (statement.name == "ValueDef") {
        break;
      }

      if (statement.name == "Spec") { //TODO: make this more programmatic
        argString = [{ keyword: "private", name: "mark", type: "Mark" }, { keyword: "private", name: "data", type: "string" } ,{ keyword: "private", name: "encode", type: "Encoding" }]
      }
      emit(generateClass(className, createArgString(argString, true), []));
      emit(generateExportFunction(className, className, argString));
      break;
    }

    case ts.SyntaxKind.InterfaceDeclaration: {

      if (statement.name == "LayerSpec") {
        break;
      }
      if (statement.name == "FieldDef") {
        for (let [name, type] of Object.entries(statement.members)) {
          fieldDefArgs.push({ keyword: "private", name: name, type: statement.memberUnionTypes[name] ? `"${statement.memberUnionTypes[name].join(`" | "`)}"` : "string" });
        }
        break;
      }

      if (statement.name == "Encoding") {

        let encodingArgs: MethodArg[] = [];
        for (let [name, type] of Object.entries(statement.members)) {
          emit(generateClass(capitalize(name), createArgString(fieldDefArgs, true), []));
          emit(generateExportFunction(name, name, fieldDefArgs));
          encodingArgs.push({ keyword: "private", name: `${name}?`, type: `${capitalize(name)}` });
        }
        emit(generateClass(statement.name, createArgString(encodingArgs, true), []));
        emit(generateExportFunction("encode", statement.name, encodingArgs));
        break;
      }
    }
  }
}

export function generatetoJSON() {
  emit(`export function toJSON(obj: any){
      return JSON.stringify(obj);
    }`);
}

export function generatetoSpec() {
  emit(`export function toSpec(obj: any){
      return obj;
    }`);
}

//Write to the output file.
export function writeFile(outputFile: string) {
  fs.writeFileSync(outputFile, emit.code());
}

export function getEmitCode(): string {
  return emit.code();
}