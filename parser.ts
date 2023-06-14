//Adapted from https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
import * as ts from "typescript";
import * as fs from 'fs';
import { ASTStatement } from "./internalRepresentation";

const sourceFiles = ["SourceFiles/SourceVLType.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();

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

export function generateStatements(jsonStatements: any) {
  let Statements: ASTStatement[] = [];
  
  for (let i = 0; i < jsonStatements.length; i++) {

    let name = jsonStatements[i].name.escapedText
    let kind = jsonStatements[i].kind
    let children: string[] = [];

    //for type alias declarations
    if ("type" in jsonStatements[i]) {
      let type = jsonStatements[i].type.kind //need to adjust for members //check for member 
      if (type == ts.SyntaxKind.UnionType) {
        let unionTypes: string[] = [];

        if ("types" in jsonStatements[i].type && "literal" in jsonStatements[i].type.types[0]) {
          for (let k = 0; k < jsonStatements[i].type.types.length; k++) {
            unionTypes.push(jsonStatements[i].type.types[k].literal.text);
            children.push(jsonStatements[i].type.types[k].literal.text);
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
              children.push(jsonStatements[i].type.types[k].typeName.escapedText);
            }
          }
        }
        //TODO: add logic to keep track of the type from ValueDef used in ColorDef
        const Statement = new ASTStatement(name, kind, type, undefined, undefined, unionTypes, children);
        Statements.push(Statement);
      }
      else if ("members" in jsonStatements[i].type) {
        const members: Record<string, string> = {};
        let memberUnionTypes: Record<string, string[]> = {};
        let j = 0;

        //members population
        for (j = 0; j < jsonStatements[i].type.members.length; j++) {
          members[jsonStatements[i].type.members[j].name.escapedText] = (jsonStatements[i].type.members[j].name.kind).toString();
          
          if (jsonStatements[i].type.members[j].type.typeName){
            children.push(jsonStatements[i].type.members[j].type.typeName.escapedText);
          }
           //TODO: include kind to primitive type conversion
          else{
            children.push(jsonStatements[i].type.members[j].type.kind);
          }
          
          if (jsonStatements[i].type.members[j].type.kind == ts.SyntaxKind.UnionType) {

            let unionTypes: string[] = [];

            for (let k = 0; k < jsonStatements[i].type.members[j].type.types.length; k++) {
              unionTypes.push(jsonStatements[i].type.members[j].type.types[k].literal.text);
            }
            // console.log(unionTypes);
            memberUnionTypes[jsonStatements[i].type.members[j].name.escapedText] = unionTypes;
          }
        }
        const Statement = new ASTStatement(name, kind, undefined, members, memberUnionTypes, undefined, children);
        Statements.push(Statement);

      }
      else {
        children.push(jsonStatements[i].type.typeName.escapedText)
        const Statement = new ASTStatement(name, kind, type, undefined, undefined, undefined, children);
        
        Statements.push(Statement);
      }
      console.log(name, kind, type, children);
    }

    //for interfaces
    else if ("members" in jsonStatements[i]) {
      const members: Record<string, string> = {};
      let memberUnionTypes: Record<string, string[]> = {};
      let j = 0;

      //members population
      for (j = 0; j < jsonStatements[i].members.length; j++) {
        members[jsonStatements[i].members[j].name.escapedText] = (jsonStatements[i].members[j].name.kind).toString();
        // having inner type
        if("type" in jsonStatements[i].members[j] && "typeName" in jsonStatements[i].members[j].type){
          children.push(jsonStatements[i].members[j].type.typeName.escapedText);
          // console.log("############");
          // console.log(jsonStatements[i].members[j]);
          // console.log(jsonStatements[i].members[j].type.typeName.escapedText);
          // console.log("############");

        }
        //TODO: add syntax kind conversion
        else{
          children.push(jsonStatements[i].members[j].type.kind);
        }
        
        if (jsonStatements[i].members[j].type.kind == ts.SyntaxKind.UnionType) {

          let unionTypes: string[] = [];

          for (let k = 0; k < jsonStatements[i].members[j].type.types.length; k++) {
            unionTypes.push(jsonStatements[i].members[j].type.types[k].literal.text);
          }
          memberUnionTypes[jsonStatements[i].members[j].name.escapedText] = unionTypes;
        }
      }
      const Statement = new ASTStatement(name, kind, undefined, members, memberUnionTypes, undefined,children);
      Statements.push(Statement);
      console.log(name, kind, members, memberUnionTypes, children);

    }
  }
  return Statements;
}

export function generateNewStatements(file: string) {
  let Statements: ASTStatement[] = [];
  const source = fs.readFileSync(file, 'utf-8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);

  ts.forEachChild(sourceFile, visit);

  // visit each node in the sourceFile
  function visit(node: ts.Node) {
    if(ts.isInterfaceDeclaration(node)){
      Statements.push(createNewInterfaceStatement(node));
    }
    if(ts.isTypeAliasDeclaration(node)){
      // try on type checker
      // let symbol = checker.getSymbolAtLocation(node.name);
      // const dec = node as ts.TypeAliasDeclaration;
      // const type = checker.getTypeAtLocation(node.name)
      // console.log(node.name.getText(), checker.typeToString(type));
      // for (const prop of type.getProperties()) {
      //   console.log("##")
      //   const name = prop.getName();
      //   const type = checker.getTypeOfSymbolAtLocation(prop, node.name);
      //   console.log(name, checker.typeToString(type));
      // }
      Statements.push(createNewTypeStatement(node));
    }
    ts.forEachChild(node, visit);
  }

  return Statements;
}

function createNewInterfaceStatement(node: ts.Node): ASTStatement {
  if(ts.isInterfaceDeclaration(node)){
    let symbol = checker.getSymbolAtLocation(node.name);
    let name = node.name.text;
    let children: string[] = [];
    const members: Record<string, string> = {};
    node.members.forEach((member) => {
      if(ts.isPropertySignature(member)){
        let memberName: string = `${member.name?.getText()}${member.questionToken? "?" : ""}`;
        let memberType: string = member.type? member.type.getText() : "undefined";
        if (member.type?.kind == ts.SyntaxKind.TypeReference){
          // if(member.type){
          //   checker.getTypeAtLocation(member.type).getSymbol()?.getDeclarations()?.forEach((declaration) => {
          //     if(ts.isInterfaceDeclaration(declaration)){
          //       children.push(declaration.name.getText());
          //     }
          //   });
          // }
        } else {        
          members[memberName] = memberType;
        }
      }
    });
    return new ASTStatement(name, 261, undefined, members, undefined, undefined, children);
  } else {
    throw new Error("Node is not an interface declaration");
  }
}

function createNewTypeStatement(node: ts.Node): ASTStatement {
  if(ts.isTypeAliasDeclaration(node)){
    let name = node.name.text;
    let children: string[] = [];
    const members: Record<string, string> = {};
    if(ts.isTypeLiteralNode(node.type)){
      node.type.members.forEach((member) => {

      });
    } else if (ts.isTypeNode(node.type)){

    }
    return new ASTStatement(name, 262, undefined, members, undefined, undefined, children);
  } else {
    throw new Error("Node is not an interface declaration");
  }
}