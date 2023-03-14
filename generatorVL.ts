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

//Code for creating the Mark object. TODO: put everything below in another file
const obj = JSON.parse(json);
const markTypeName = obj.statements[4].name.escapedText
//TODO: this extracts the union type. Use this information later for modularizing the generator.
const markTypePrimitive = obj.statements[4].type.kind 

//if the type is union, create a string by looping through types and adding |.
let argString: string[] = [];
for (let i = 0; i < 3; i++) {
  let string = obj.statements[4].type.types[i].literal.text;
  argString.push(string);
}
console.log(argString);

//Create the parameter.
const markParameters = ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("arg"), undefined, ts.factory.createUnionTypeNode([ts.factory.createLiteralTypeNode(
  ts.factory.createStringLiteral(argString[0])),ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(argString[1])) ,ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(argString[2]))]));

//Create the function statements
const constructorBlock = ts.factory.createBlock([ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createSuper(), [], [])), ]);

//Use constructor factory method for the constructor
const constructor = ts.factory.createConstructorDeclaration([], [markParameters], constructorBlock);

//TODO: change string parameter to encode types
const encodeParameters = ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("values"), undefined, ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword));

const encodeBlock = ts.factory.createBlock([ts.factory.createReturnStatement(ts.factory.createIdentifier('values'))]);

// Create the member function. TODO: modify for other methods to be added
const encode = ts.factory.createMethodDeclaration([], undefined, 'encode', undefined, [], [encodeParameters], undefined, encodeBlock);

//create heritage clause that extends the BaseObject
const heritageClause = ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword,[ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier('BaseObject'), undefined)]);

//Creating the class.
const classMark = ts.factory.createClassDeclaration([ts.factory.createToken(ts.SyntaxKind.ExportKeyword)], markTypeName, [], [heritageClause], [constructor, encode]);

//Create a new sourceFile object for the new file.
const generatedFile = ts.createSourceFile("generatedfile.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

//Create TS printer instance which gives us utilities to pretty print our final AST.
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

//Get the code text from the AST.
const result = printer.printNode(ts.EmitHint.Unspecified, classMark, generatedFile);
console.log(result);

//Write to a new file.
fs.writeFileSync('generatedVLFile.ts', result);