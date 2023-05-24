import { emitter, capitalize, decapitalize, isString } from "./util"
const emit = emitter('utils')

interface Method {
  name: string;
  args: MethodArg[];
  body: string;
}

export interface MethodArg {
  keyword?: string;
  name: string;
  type: string;
}

//convert methodArgs to a string
export function createArgString(methodArgs: MethodArg[],keywords: boolean): string{
  let result = "";
  if (keywords){
    return methodArgs.map(arg => `${arg.keyword? `${arg.keyword}` : ""} ${arg.name}: ${arg.type}`).join(", ");
  }
  else{
    return methodArgs.map(arg => `${arg.name}: ${arg.type}`).join(", ");
  }
}

//not used yet
export function generateClassMemberMethod(name: string, args: MethodArg[], body: string): string {
  return `${name}(${createArgString(args,true)}) {\n${body}\n}`;
}

export function generateExportFunction(functionName: string, objName: string, args: MethodArg[]) {
  let exportargs: string[] = args.map(arg => arg.name);
  if (exportargs[0].slice(-1) === '?'){
    exportargs = exportargs.map(arg => arg.slice(0,-1));
  }
  
  return `export function ${decapitalize(functionName)}(${createArgString(args, false)}){
    return new ${capitalize(objName)}(${exportargs.join(", ")});\n}
`;
}
//Takes in args as string
export function generateClass(name: string, args: string, methods: Method[]): string {
  const methodStrings = methods.map((method) => {
    return `${method.name}(${method.args}) {${method.body}}`;
  });

  const arg = decapitalize(name);
  return `class ${name} {
    constructor(${args}) {}
    ${methodStrings.join('\n\n')}\n}
  `;
}