import { parse, generateStatements } from "../parser";
import { ASTStatement } from "../internalRepresentation";
// import {generateVLAPI, generatetoSpec, getEmitCode} from "../../api"

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