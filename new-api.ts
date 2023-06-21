import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./IR"
import { emitter, capitalize, decapitalize } from "./util"
const emit = emitter('')

function emitClass (className: string, consArg: string, consSpec: string) {
    emit(`class ${className} extends BaseObject {`);
    emit(`\tconstructor(${consArg}){\n\t\tsuper();\n\t\tinit(this);`);
    emit(`\t\t${consSpec}`);
    emit(`\t}\n`);
}

function emitClassEnd () {
    emit(`}\n`);
}

function emitMethod (methodName: string, args?: {"name": string, "type": string}[], methodSpec: string = "", returnType: string = ""){
    emit(`\t${methodName}(${args?.map(arg => `${arg.name}: ${arg.type}`).join(", ")}){`);
    // emit(`\t\t${methodSpec}`);
}

function emitMethodEnd() {
    emit(`\t}\n`);
}

function emitExportFunction(methodName: string, className: string, args: {"name": string, "type": string}[]) {
    emit(`export function ${methodName}(${args?.map(arg => `${arg.name}: ${arg.type}`).join(", ")}){`);
    emit(`\treturn new ${className}(${args?.map(arg => `${arg.name}`).join(",")});`);
    emit(`}\n`);
}

function emitSpecMethod(name: string) {
    emit(`\t\tif (value !== undefined) {`);
    emit(`\t\t\tconst obj = copy(this);`);
    emit(`\t\t\tset(obj, "${name}", value);`);
    emit(`\t\t\treturn obj;`);
    emit(`\t\t} else {`);
    emit(`\t\t\treturn get(this, "${name}");`);
    emit(`\t\t}`);
}

export function generateUtilImport() {
    emit(`import { BaseObject, copy, get, init, set, merge, raw, assign, isArray, isIterable, isString } from "./util";\n`);
}

export function generateVLAPI(statements: ASTStatement[], statementNameIndexMap: Map<string, number>) {

    var toFindNameList: string[] = [];

    // find spec
    const index = statementNameIndexMap.get("Spec");
    if (index !== undefined){
        const specSmt = statements[index];
        emitClass("Spec", "", "");
        specSmt.members.forEach(member => {
            emitMethod(member.name, [{"name": "value", "type": member.type}]);
            emitSpecMethod(member.name);
            emitMethodEnd();
        });
        emitClassEnd();
        emitExportFunction("spec", "Spec", []);
        // create spec member classes
        specSmt.members.forEach(member => {
            if (member.name === "data"){
                emitClass("Data", "private value: string", `if(value !== undefined) set(this, "data", value);`);
                emitClassEnd();
                emitExportFunction("data", "Data", [{"name": "value", "type": "string"}]);
            } else {

            }
        });
    }




}

export function generatetoJSON() {
    emit(`export function toJSON(obj: any){`);
    emit(`\treturn JSON.stringify(obj);`);
    emit(`}\n`);
}

export function generatetoSpec() {
    emit(`export function toSpec(obj: any){`);
    emit(`\treturn obj;`);
    emit(`}\n`);
}

//Write to the output file.
export function writeFile(outputFile: string) {
    fs.writeFileSync(outputFile, emit.code());
}

export function getEmitCode(): string {
    return emit.code();
}