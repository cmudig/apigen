
import ts, { unescapeLeadingUnderscores } from "typescript";
import * as fs from 'fs';
import { parse } from "./parser"
import { ASTStatement } from "./internalRepresentation"
import { generateClass, writeFile,generateClassMemberMethod } from "./generateClass"

//Create a file and write the first essential line.
let outputFile = "generatedVLClasses.ts"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);

let i = 0;
//TODO: replace this with a programmatic function and possibly with ts morph
let argsList: string[] = [];
let len = obj.statements[4].type.types.length
for (i = 0; i < len; i++) {
  let string = obj.statements[4].type.types[i].literal.text;
  argsList.push(string);
}

let jsonStatements = obj.statements;

//main for loop
let Statements: ASTStatement[] = [];
for (i = 0; i < jsonStatements.length; i++) {

  let name = jsonStatements[i].name.escapedText
  let kind = jsonStatements[i].kind
  if ("type" in jsonStatements[i]) {
    let type = jsonStatements[i].type.kind //need to adjust for members //check for member 
    const Statement = new ASTStatement(name, kind, type);
    Statements.push(Statement);
  }
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
// console.log(Statements[0].memberUnionTypes);
// console.log(generateClassMemberMethod("fieldQ", []));
generateClass(Statements[4], argsList);
writeFile(outputFile);
//for statements in AST
      //get statement.kind
          //if kind is type alias declaration,
              //determine whether a class needs to be created or a method needs to be added to the class
              //if the method needs to be added, create the class first
                    //determine which class it belongs to: how? by traversing the AST and getting the escaped text that matches it
                    //how to traverse nested json to get text that matches yours.



