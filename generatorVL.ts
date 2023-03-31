import { parse, generateStatements } from "./parser"
import {generateVLAPI, writeFile, generatetoSpec} from "./api"

//Create a file and write the first essential line.
let outputFile = "generatedVLClasses.ts"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);
let jsonStatements = obj.statements;

//Generate an internal representation
const Statements = generateStatements(jsonStatements);
// console.log(Statements);

//generate Mark
generateVLAPI(Statements[4]);

//generate Spec
generateVLAPI(Statements[7]);

//generate the json spec
generatetoSpec();
writeFile(outputFile);




