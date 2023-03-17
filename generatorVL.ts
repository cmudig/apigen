//Adapted from https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
import ts from "typescript";
import * as fs from 'fs';
import { parse } from "./parser"
import { Project, SyntaxKind } from "ts-morph";
import {emitter} from "./util"

//Get the AST as a json that can be traversed
const json = parse(process.argv[2])

//Get the simplified version of the AST
const obj = JSON.parse(json);

//Create a file and write the first essential line.
let outputFile = "generatedVLClasses.ts"

const emit = emitter('util.ts')

//if the type is union, create a string by looping through types and adding |.TODO: replace this with ts morph
let argString: string[] = [];
let len = obj.statements[4].type.types.length
for (let i = 0; i < len; i++) {
  let string = obj.statements[4].type.types[i].literal.text;
  argString.push(string);
}

// console.log(argString);
const markTypeName = obj.statements[4].name.escapedText


//TODO: this extracts the union type. Use this information later for modularizing the generator.
const markTypePrimitive = obj.statements[4].type.kind //gives union type

//To create a class, we need a 
//constructor
//args
//super, if the obj extends a base class
//init, -> when?
// 

//Write to a new file.
fs.writeFileSync(outputFile, emit.code());