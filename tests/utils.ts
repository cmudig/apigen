import { parse, generateStatements } from "../parser";
import { ASTStatement } from "../internalRepresentation";
import {generateVLAPI, generatetoSpec, getEmitCode} from "../api";
import * as fs from 'fs';

/**
 * Parse the given file and generate ASTStatement list.
 * @param file a ts file
 * @returns ASTStatement list that represents the given file
 */
export function parseFile (file: string) : ASTStatement[] {
    const json = parse(file)
    const obj = JSON.parse(json);
    let jsonStatements = obj.statements;
    const Statements = generateStatements(jsonStatements);
    return Statements;
}

export function validateOutput (inputFile: string, expectedOutputFile: string) : void {
    const Statements = parseFile(inputFile);
    for (let i = 0; i < Statements.length; i++){
        generateVLAPI(Statements[i]);
    }
    generatetoSpec();
    expect(getEmitCode()).toMatchSnapshot();
    const expectedOutput = fs.readFileSync(expectedOutputFile, 'utf-8')
    expect(getEmitCode()).toEqual(expectedOutput);
}