import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./internalRepresentation"
import { emitter, capitalize, decapitalize } from "./util"
import { generateExportFunction, generateClass, generateClassMemberMethod, MethodArg, createArgString } from "./generate";
// import { fieldDefs } from "vega-lite/build/src/encoding";
// import { encoding } from "./scratch/classes";

const emit = emitter('')
let fieldDefArgs: MethodArg[] = [];

export function generateVLAPI(statement: ASTStatement) {

  const className = capitalize(statement.name as string);

  switch (statement.kind) {
    case ts.SyntaxKind.TypeAliasDeclaration: {

      if (statement.name == "ColorDef") {
        break;
      }

      if (statement.name == "PositionDef") {
        break;
      }

      if (statement.name == "ValueDef") {
        break;
      }

      let argName = "";
      if (statement.type == ts.SyntaxKind.UnionType) {
        argName = "type";
      }
      else {
        argName = decapitalize(className);
      }
      //prepare constructor argument string
      let argString: MethodArg[] = [];
      if (statement.args != undefined) {
        argString = [{ keyword: "private", name: argName, type: `"${statement.args.join('" | "')}"` }];
      }
      if (statement.name == "Spec") {
        argString = [{ keyword: "private", name: "mark", type: "Mark" }, { keyword: "private", name: "encode", type: "Encoding" }]
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

export function generatetoSpec() {
  emit(`export function toSpec(obj: any){
      return JSON.stringify(obj);
    }`);
}

//Write to the output file.
export function writeFile(outputFile: string) {
  fs.writeFileSync(outputFile, emit.code());
}

export function getEmitCode(): string {
    return emit.code();
}