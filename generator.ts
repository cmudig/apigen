//messy playground file to check types etc

import ts from "typescript";
import * as fs from 'fs';
// import NodeFactory from "typescript"
import { type } from "os";

// hardcode our input file
const filePath = "sourceFile.ts";

// create a program instance, which is a collection of source files
// in this case we only have one source file
let program = ts.createProgram([filePath], {}); //(not needed)

// pull off the typechecker instance from our program (not needed)
const checker = program.getTypeChecker();

// get our models.ts source file AST
const source = ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(),
ts.ScriptTarget.ES2015, true
/*setParentNodes */);


// create TS printer instance which gives us utilities to pretty print our final AST
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

// helper to give us Node string type given kind
const syntaxToKind = (kind: ts.Node["kind"]) => {
  return ts.SyntaxKind[kind];
};


// visit each node in the root AST and log its kind

ts.forEachChild(source, node => {
  
  if (ts.isTypeAliasDeclaration(node)) {
      // console.log(node);
      // let symbol = checker.getSymbolAtLocation(node);
      // console.log(symbol?.getName());
      const type_name = node.name.escapedText;
      console.log(ts.getModifiers(node));
      // const export_word = ts.getModifiers(node);
      // console.log(syntaxToKind(source?.getChildren()[0].getChildren()[0][“type”][“kind”]));
      // const type = checker.getTypeAtLocation(node);
      // const typeName = checker.typeToString(type, node);
      // const name = checker.getFullyQualifiedName(symbol);
      // if (symbol) const alias = checker.getAliasedSymbol(symbol);
      // console.log(node);
    } 
   });

   const factory =  <ts.NodeFactory>{};
   const memberElements = <readonly ts.ClassElement[]>{};
   const modifier = <readonly ts.ModifierLike[]>{};
  //  const modifier = 
  // const classNode = ts.factory.createClassDeclaration(modifier,type_name, undefined, undefined, memberElements);

  // console.log (classNode);


// //create a new SourceFile that we will use to take in the AST and generate a new file
const generatedFile = ts.createSourceFile("generatedfile.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

// //get the code text from the AST
// const result = printer.printNode(ts.EmitHint.Unspecified, classNode, generatedFile);
// console.log(result);

// //write to a new file
// fs.writeFileSync('generated-file.ts', result);


//TODO: search on these
// what does getAliasedSymbol do?
// console.log(checker.getAliasedSymbol)
// what does getSymbolAtLocation do?
// what does getFullyQualifiedName do?
