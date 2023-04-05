import { emitter, capitalize, decapitalize } from "./util"
import { ASTStatement } from "./internalRepresentation"
import ts, { classicNameResolver } from "typescript";

import { Project, Statement, SyntaxKind } from "ts-morph";

const emit = emitter('utils')

interface Method {
  name: string;
  args: string;
  body: string;
}

//not used yet
export function generateClassMemberMethod(name: string, args: string, body: string): string {
  return `${name}(${args}) {\n${body}\n}`;
}
//not used currently
export function generateConstructor(constructorArgs: string, name?: string | undefined) {
  {
    if (constructorArgs.length == 0) {
      emit('constructor(){')
    }
    else {
      emit(`constructor(private ${decapitalize(name)}:  "${constructorArgs}"){`).indent();
    }
    // emit('super();');
    emit('}').outdent().outdent();
    emit('}');
  }
}

export function generateExportFunction(name: string, args: string) {
  return `export function ${decapitalize(name)}(${args}){
    return new ${capitalize(name)}(${decapitalize(args.split(':')[0])});
  }
`;
}

export function generateClass(name: string, args: string, methods: Method[]): string {
  const methodStrings = methods.map((method) => {
    return `${method.name}(${method.args}) {${method.body}}`;
  });

  const arg = decapitalize(name);
  return `class ${name} {
    constructor(private ${args}) {}
    ${methodStrings.join('\n\n')}
  }
  `;
}

