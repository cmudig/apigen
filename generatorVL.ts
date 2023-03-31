
import ts, { unescapeLeadingUnderscores } from "typescript";
import * as fs from 'fs';
import { parse } from "./parser"
import { ASTStatement } from "./internalRepresentation"
import {generateVLAPI, writeFile} from "./api"

//Create a file and write the first essential line.
let outputFile = "generatedVLClasses.ts"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);

let i = 0;

let jsonStatements = obj.statements;

//main for loop (TODO: make this into its own function)
let Statements: ASTStatement[] = [];
for (i = 0; i < jsonStatements.length; i++) {
  console.log(i);
  let name = jsonStatements[i].name.escapedText
  let kind = jsonStatements[i].kind

  //for type alias declarations
  if ("type" in jsonStatements[i]) {
    let type = jsonStatements[i].type.kind //need to adjust for members //check for member 
    if (type == ts.SyntaxKind.UnionType) {

      if ("types" in jsonStatements[i].type && "literal" in jsonStatements[i].type.types[0]) {
        let unionTypes: string[] = [];
        for (let k = 0; k < jsonStatements[i].type.types.length; k++) {
          unionTypes.push(jsonStatements[i].type.types[k].literal.text);
        }
        const Statement = new ASTStatement(name, kind, type, undefined, undefined, unionTypes);
        Statements.push(Statement);
      }
      if ("types" in jsonStatements[i].type && "typeName" in jsonStatements[i].type.types[0]) {
        let unionTypes: string[] = [];
        for (let k = 0; k < jsonStatements[i].type.types.length; k++) {
          unionTypes.push(jsonStatements[i].type.types[k].typeName.escapedText);
        }
        const Statement = new ASTStatement(name, kind, type, undefined, undefined, unionTypes);
        Statements.push(Statement);
      }
    }
    else if ("members" in jsonStatements[i].type){
      const members: Record<string, string> = {};
    let memberUnionTypes: Record<string, string[]> = {};
    let j = 0;

    //members population
    for (j = 0; j < jsonStatements[i].type.members.length; j++) {
      members[jsonStatements[i].type.members[j].name.escapedText] = jsonStatements[i].type.members[j].name.kind;
      if (jsonStatements[i].type.members[j].type.kind == ts.SyntaxKind.UnionType) {

        let unionTypes: string[] = [];

        for (let k = 0; k < jsonStatements[i].type.members[j].type.types.length; k++) {
          unionTypes.push(jsonStatements[i].type.members[j].type.types[k].literal.text);
        }
        console.log(unionTypes);
        memberUnionTypes[jsonStatements[i].type.members[j].name.escapedText] = unionTypes;
      }
    }
    const Statement = new ASTStatement(name, kind, undefined, members, memberUnionTypes);
    Statements.push(Statement);

    }
    else {
      const Statement = new ASTStatement(name, kind, type);
      Statements.push(Statement);
    }
  }

  //for interfaces
  else if ("members" in jsonStatements[i]) {
    const members: Record<string, string> = {};
    let memberUnionTypes: Record<string, string[]> = {};
    let j = 0;

    //members population
    for (j = 0; j < jsonStatements[i].members.length; j++) {
      members[jsonStatements[i].members[j].name.escapedText] = jsonStatements[i].members[j].name.kind;
      if (jsonStatements[i].members[j].type.kind == ts.SyntaxKind.UnionType) {

        let unionTypes: string[] = [];

        for (let k = 0; k < jsonStatements[i].members[j].type.types.length; k++) {
          unionTypes.push(jsonStatements[i].members[j].type.types[k].literal.text);
        }
        console.log(unionTypes);
        memberUnionTypes[jsonStatements[i].members[j].name.escapedText] = unionTypes;
      }
    }
    const Statement = new ASTStatement(name, kind, undefined, members, memberUnionTypes);
    Statements.push(Statement);
  }
}

// function createAndPushStatment(Statements)
console.log(Statements);

generateVLAPI(Statements[4]);
generateVLAPI(Statements[7]);
writeFile(outputFile);




