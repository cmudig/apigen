import { parse, generateStatements } from "./parser"
import {generateVLAPI, writeFile, generatetoSpec} from "./api"

//Create a file and write the first essential line.
let outputFile = "generate/generatedVLClasses.ts"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);
let jsonStatements = obj.statements;

//Generate an internal representation
const Statements = generateStatements(jsonStatements);

for (let i = 0; i < Statements.length; i++){
    generateVLAPI(Statements[i]);
}
//generate the json spec
generatetoSpec();
writeFile(outputFile);
