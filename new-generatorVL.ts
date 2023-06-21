import { parse } from "./parser"
import { generateNewStatements } from "./newparser"
import * as api from "./new-api"

//Create a file and write the first essential line.
let outputFile = "generate/generatedVLClasses.ts"

//Generate an internal representation
const Statements = generateNewStatements(process.argv[2]);
// console.log(Statements);

var statementNameIndexMap = new Map<string, number>();
for (let i = 0; i < Statements.length; i++){
    statementNameIndexMap.set(Statements[i].name, i);
}

api.generateUtilImport();
api.generateVLAPI(Statements, statementNameIndexMap);
//generate the json spec
api.generatetoSpec();
api.generatetoJSON();
// console.log(api.getEmitCode());
api.writeFile(outputFile);