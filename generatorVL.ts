
// Inspiration for this script taken from StackOverflow: https://stackoverflow.com/a/20197641/26566
//Adapted from https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
import ts from "typescript";
import * as fs from 'fs';

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
});

//Parse the JSON to get the name of the type.
const obj = JSON.parse(json);
const typeName = obj.statements[0].name.escapedText
const typePrimitive = obj.statements[0].type.kind

const block = ts.factory.createBlock([ts.factory.createReturnStatement(ts.factory.createIdentifier('arg'))]);

//Create the parameter.
const parameters = ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("arg"), undefined, ts.factory.createKeywordTypeNode(typePrimitive));

//Create the member function.
const methodNode = ts.factory.createMethodDeclaration([ts.factory.createToken(ts.SyntaxKind.PublicKeyword)], undefined, 'number', undefined, [], [parameters], undefined, block);

//Creating the class.
const classNode = ts.factory.createClassDeclaration([ts.factory.createToken(ts.SyntaxKind.ExportKeyword)], typeName, [], undefined, [methodNode]);

//Create a new sourceFile object for the new file.
const generatedFile = ts.createSourceFile("generatedfile.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

//Create TS printer instance which gives us utilities to pretty print our final AST.
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

//Get the code text from the AST.
const result = printer.printNode(ts.EmitHint.Unspecified, classNode, generatedFile);

console.log(result);

//Write to a new file.
fs.writeFileSync('generated-file.ts', result);