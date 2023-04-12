//Adapted from https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./internalRepresentation";

export function parse(file: string) {
  const source = fs.readFileSync(file, 'utf-8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);

  // Add an ID to every node in the tree to make it easier to identify in
  // the consuming application.
  let nextId = 0;
  function addId(node: any) {
    nextId++;
    node.id = nextId;
    ts.forEachChild(node, addId);
  }
  addId(sourceFile);

  const cache: any = [];
  const json = JSON.stringify(sourceFile, (key, value) => {
    // Discard the following.
    if (key === 'flags' || key === 'transformFlags' || key === 'modifierFlagsCache') {
      return;
    }

    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return;

      cache.push(value);
    }
    return value;
  }
  );
  // console.log(json);
  return json;
}

// main for loop (TODO: make this into its own function and move it to the parser)
export function generateStatements(jsonStatements: any) {
  let Statements: ASTStatement[] = [];
  for (let i = 0; i < jsonStatements.length; i++) {

    let name = jsonStatements[i].name.escapedText
    let kind = jsonStatements[i].kind

    //for type alias declarations
    if ("type" in jsonStatements[i]) {
      let type = jsonStatements[i].type.kind //need to adjust for members //check for member 
      if (type == ts.SyntaxKind.UnionType) {
        let unionTypes: string[] = [];

        if ("types" in jsonStatements[i].type && "literal" in jsonStatements[i].type.types[0]) {
          for (let k = 0; k < jsonStatements[i].type.types.length; k++) {
            unionTypes.push(jsonStatements[i].type.types[k].literal.text);
          }
        }
        if ("types" in jsonStatements[i].type && "typeName" in jsonStatements[i].type.types[0]) {
          for (let k = 0; k < jsonStatements[i].type.types.length; k++) {
            if (jsonStatements[i].type.types[k].members) {
              for (let l = 0; l < jsonStatements[i].type.types[k].members.length; l++)
                unionTypes.push(`${jsonStatements[i].type.types[k].members[l].name.escapedText} : ${jsonStatements[i].type.types[k].members[l].type.typeName.escapedText}`);
            }
            else{
              unionTypes.push(jsonStatements[i].type.types[k].typeName.escapedText);
            }
          }
        }
        //TODO: add logic to keep track of the type from ValueDef used in ColorDef
        const Statement = new ASTStatement(name, kind, type, undefined, undefined, unionTypes);
        Statements.push(Statement);
      }
      else if ("members" in jsonStatements[i].type) {
        const members: Record<string, string> = {};
        let memberUnionTypes: Record<string, string[]> = {};
        let j = 0;

        //members population
        for (j = 0; j < jsonStatements[i].type.members.length; j++) {
          members[jsonStatements[i].type.members[j].name.escapedText] = (jsonStatements[i].type.members[j].name.kind).toString();
          if (jsonStatements[i].type.members[j].type.kind == ts.SyntaxKind.UnionType) {

            let unionTypes: string[] = [];

            for (let k = 0; k < jsonStatements[i].type.members[j].type.types.length; k++) {
              unionTypes.push(jsonStatements[i].type.members[j].type.types[k].literal.text);
            }
            // console.log(unionTypes);
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
        members[jsonStatements[i].members[j].name.escapedText] = (jsonStatements[i].members[j].name.kind).toString();
        if (jsonStatements[i].members[j].type.kind == ts.SyntaxKind.UnionType) {

          let unionTypes: string[] = [];

          for (let k = 0; k < jsonStatements[i].members[j].type.types.length; k++) {
            unionTypes.push(jsonStatements[i].members[j].type.types[k].literal.text);
          }
          memberUnionTypes[jsonStatements[i].members[j].name.escapedText] = unionTypes;
        }
      }
      const Statement = new ASTStatement(name, kind, undefined, members, memberUnionTypes);
      Statements.push(Statement);
    }
  }
  return Statements;
}