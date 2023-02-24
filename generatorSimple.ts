
// Inspiration for this script taken from StackOverflow: https://stackoverflow.com/a/20197641/26566
// const fs = require('fs');
// const ts = require('typescript');
import ts from "typescript";
import * as fs from 'fs';
// import ts from "typescript";
// import * as process from "./process"
// const process = require('process');

const source = fs.readFileSync(process.argv[2], 'utf-8');

const sourceFile = ts.createSourceFile(process.argv[2], source, ts.ScriptTarget.Latest, true);

// Add an ID to every node in the tree to make it easier to identify in
// the consuming application.
let nextId = 0;
function addId(node: any) {
    nextId++;
    node.id = nextId;
    ts.forEachChild(node, addId);
}
addId(sourceFile);

// No need to save the source again.
// delete sourceFile.text;

const cache:any = [];
const json = JSON.stringify(sourceFile, (key, value) => {
  // Discard the following.
  if (key === 'flags' || key === 'transformFlags' || key === 'modifierFlagsCache') {
      return;
  }
  
  // Replace 'kind' with the string representation.
  if (key === 'kind') {
      value = ts.SyntaxKind[value];
  }
  
  if (typeof value === 'object' && value !== null) {
    // Duplicate reference found, discard key
    if (cache.includes(value)) return;

    cache.push(value);
  }
  return value;
});

//Parse the JSON to get the name of the type
const obj = JSON.parse(json);
const type_name = obj.statements[0].name.escapedText
console.log(type_name);

//TODO: create the member function
// const function_node = ts.factory.createFunctionDeclaration()

//creating empty parameters to pass into classNode.TODO: change modifier to ExportKeyword
const memberElements = <readonly ts.ClassElement[]>{};
const modifier = <readonly ts.ModifierLike[]>{};

const classNode = ts.factory.createClassDeclaration(modifier, type_name, undefined, undefined, memberElements);

//to see the class AST
console.log (classNode);

//create a new sourceFile object for the new file.
const generatedFile = ts.createSourceFile("generatedfile.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

// create TS printer instance which gives us utilities to pretty print our final AST
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

//get the code text from the AST
const result = printer.printNode(ts.EmitHint.Unspecified, classNode, generatedFile);
console.log(result);

//write to a new file
fs.writeFileSync('generated-file.ts', result);