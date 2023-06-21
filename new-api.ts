import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./IR"
import { emitter, capitalize, decapitalize } from "./util"
const emit = emitter('')

function emitClass (className: string, consArg: string, consSpec: string) {
    emit(`class ${className} extends BaseObject {`);
    emit(`\tconstructor(${consArg}){\n\t\tsuper();\n\t\tinit(this);`);
    emit(`\t\t${consSpec}`);
    emit(`\t}`);
    emit(`}\n`);
}

export function generateUtilImport() {
    emit(`import { BaseObject, copy, get, init, set, merge, raw, assign, isArray, isIterable, isString } from "./util";\n`);
}

export function generateVLAPI(statements: ASTStatement[], statementNameIndexMap: Map<string, number>) {
    // find spec
    for (const statement of statements) {
        if (statement.name === "Spec") {
            console.log("found spec");
            emitClass("Spec", "", "");
            console.log(statement.members);
            // statement.members.forEach(member => {
                // console.log(member);
            // });
        }
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