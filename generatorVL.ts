import { parse, generateStatements } from "./parser"
import * as api from "./api"
import { generateNewStatements } from "./newparser"

//Create a file and write the first essential line.
let outputFile = "generate/generatedVLClasses.ts"

if (process.argv[3] === "new"){
    const Statements = generateNewStatements(process.argv[2]);
    console.log(Statements);
} else {
    //Get the AST as a json that can be traversed
    const json = parse(process.argv[2])

    //Get the simplified version of the AST
    const obj = JSON.parse(json);
    let jsonStatements = obj.statements;
    // console.log(json);

    //Generate an internal representation
    const Statements = generateStatements(jsonStatements);
    // console.log(Statements);

    for (let i = 0; i < Statements.length; i++){
        api.generateVLAPI(Statements[i]);
    }
    //generate the json spec
    api.generatetoSpec();
    api.generatetoJSON();
    api.writeFile(outputFile);
}



