
import ts from "typescript";
import * as fs from 'fs';

// hardcode our input file
const filePath = "sourceFile.ts";

// create a program instance, which is a collection of source files
// in this case we only have one source file
// let program = ts.createProgram([filePath], {}); (not needed)

// pull off the typechecker instance from our program (not needed)
// const checker = program.getTypeChecker();

// get our models.ts source file AST
const source = ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(),
ts.ScriptTarget.ES2015,
/*setParentNodes */ true);

// create TS printer instance which gives us utilities to pretty print our final AST
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

// helper to give us Node string type given kind
const syntaxToKind = (kind: ts.Node["kind"]) => {
  return ts.SyntaxKind[kind];
};

console.log("\n********** This is an overview of the file ************\n");

// visit each node in the root AST and log its kind
ts.forEachChild(source, node => {
  console.log(syntaxToKind(node.kind));
});

console.log("\n********************** And this is the full AST *******************\n");
// console.log(printer.printNode(ts.EmitHint.Expression, source, program));
ts.forEachChild(source, node => {
    if (ts.isTypeAliasDeclaration(node)) {
      console.log(node);
    }
  });

console.log("\n********************** Attempting to generate a file *******************\n");

//create a new SourceFile that we will use to take in the AST and generate a new file
const generatedFile = ts.createSourceFile("generatedfile.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

//get the code text from the AST
const result = printer.printNode(ts.EmitHint.Unspecified, source, generatedFile);
console.log(result);

//write to a new file
fs.writeFileSync('generated-file.ts', result);