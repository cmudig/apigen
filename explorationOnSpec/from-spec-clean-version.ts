const DEBUG_MODE = false;
const TYPE_MODE = true;
// const TYPE_MODE = false;

import * as ts from "typescript";
import fs from 'fs';
import { emitter } from './generate-util';

const sourceFiles = ["vega-lite-src/spec/index.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("vega-lite-src/spec/index.ts")!;

// const visitedTypes = new WeakSet<ts.Node|ts.Type>();
const vlTypes = new WeakSet<VegaLiteType>();
const objectFlagSet = new Set();
const flagSet = new Set();

// internal representation of a type
class VegaLiteType {
    name: string;
    type: ts.Type;
    // kind: TypeKind;
    children: VegaLiteType[] = [];
    oneLevelType: string = "";
    properties: VegaLiteType[] = [];
    description?: string;   //TODO: get descirption and generate documentation

    constructor(name: string, type: ts.Type, children: VegaLiteType[]) {
        this.name = name;
        this.type = type;
        // this.kind = kind;
        this.children = children;
        // this.oneLevelType = this.updateOneLevelType();
        // this.properties = (type as any).properties;
    }

    generateOneLevelType(): string {
        // switch (this.kind) {
        //     case TypeKind.Union:
        //         return this.children.map(child => child.generateOneLevelType()).join(" | ");
        //     case TypeKind.Intersection:
        //         return this.children.map(child => child.generateOneLevelType()).join(" & ");
        //     case TypeKind.Literal:
        //         return this.name;
        //     case TypeKind.TypeParameter:
        //         return this.name;
        //     case TypeKind.Other:
        //         return this.name;
        // }
        switch (this.type.flags) {
            case ts.TypeFlags.Union:
                return this.children.map(child => child.generateOneLevelType()).join(" | ");
            case ts.TypeFlags.Intersection:
                return this.children.map(child => child.generateOneLevelType()).join(" & ");
            case ts.TypeFlags.Literal:
                return this.name;
            case ts.TypeFlags.TypeParameter:
                return this.name;
            default:
                return this.name;          
        }
    }

    updateOneLevelType(): void {
        this.oneLevelType = this.generateOneLevelType();
    }
}

enum TypeKind {
    Union,
    Intersection,
    Literal,
    TypeParameter,
    Other
}

const VegaLiteTypeMap = new Map<string, VegaLiteType>();

// main process
const specNode = findTopLevelSpec(sourceFile);
if (ts.isUnionTypeNode(specNode)) {
    const types = specNode.types;
    for(const type of types) {
        if(ts.isTypeReferenceNode(type)) {
            if(DEBUG_MODE) console.log("###############", type.getText(),"###############");
            // findType(type, 1);
            findFromType(checker.getTypeAtLocation(type), 1);
        }
    }
}

// find TopLevelSpec
function findTopLevelSpec(sourceFile: ts.SourceFile): ts.UnionTypeNode {
    for (const statement of sourceFile.statements) {
        if (ts.isTypeAliasDeclaration(statement) && statement.name.getText() === "TopLevelSpec"){
            if(DEBUG_MODE) console.log(statement.name.getText());
            if(ts.isUnionTypeNode(statement.type)) {
                return statement.type;
            }  
        }
    }
    throw new Error("TopLevelSpec not found");
}

// recursively get types and their properties
function findFromType(type: ts.Type, depth: number): VegaLiteType {
    flagSet.add(type.flags);
    const prefix:string = new Array(depth).fill("-").join("");
    const typeName = checker.typeToString(type);
    if(DEBUG_MODE) console.log(prefix+"findFromType:", typeName);

    var curVegaLiteType = VegaLiteTypeMap.get(typeName);
    if (curVegaLiteType !== undefined) {
        return curVegaLiteType;
    } else {
        curVegaLiteType = new VegaLiteType(typeName, type, []);
        VegaLiteTypeMap.set(typeName, curVegaLiteType);
    }

    const objectFlags = (type as any).objectFlags;
    if (objectFlags !== undefined){
        objectFlagSet.add(objectFlags);
        const tp_properties = type.getProperties();
        if (tp_properties.length > 0) {
            for (const tp_property of tp_properties) {
                if (tp_property.name.startsWith("$")) {
                    continue;
                }
                if (tp_property.name.startsWith("__")) {
                    continue;
                }
                const dec = tp_property.valueDeclaration;
                if (dec !== undefined) {
                    const symbolType = checker.getTypeOfSymbolAtLocation(tp_property, dec);
                    const symbolTypeText = checker.typeToString(symbolType);
                    if(DEBUG_MODE) console.log(prefix+"@@property", tp_property.name, ":", symbolTypeText, "{");
                    const objectFlags = (symbolType as any).objectFlags;
                    if (objectFlags !== undefined){
                        objectFlagSet.add(objectFlags);
                        curVegaLiteType.properties.push(findFromType(symbolType, depth+1));
                        // if (!!(objectFlags & ts.ObjectFlags.Reference)) {
                        //     console.log(prefix+"objectFlags:", objectFlags);
                        //     findFromType(symbolType, depth+1);
                        // }
                    }
                    if(DEBUG_MODE) console.log(prefix+"}");
                } else {
                    if(DEBUG_MODE) console.log(prefix+"@@property(can't find type of it)", tp_property.name)
                }
            }
            curVegaLiteType.updateOneLevelType();
        }
    }
        
    if (type.isUnion() || type.isIntersection()) {
        const types = type.types;
        for (const tp of types) {
            curVegaLiteType.children.push(findFromType(tp, depth+1));
        }
        curVegaLiteType.updateOneLevelType();
    }
    else if (type.isLiteral()) {
        curVegaLiteType.oneLevelType = convertLiteralToString(type.value);
        if(DEBUG_MODE) console.log(prefix+"@literal:", type.value);
    } else {
        curVegaLiteType.oneLevelType = checker.typeToString(type);
    }
    // else if (type.isTypeParameter()) {
    //     const name = 
    //     curVegaLiteType.oneLevelType = type.symbol.getEscapedName();
    //     console.log(prefix+"@typeParameter", type.symbol.getEscapedName());
    // }

    const node = (type as any).node;
    if (node !== undefined) {
        generateClass(type, node);
    }
    if (TYPE_MODE) console.log(curVegaLiteType.name, typeName, curVegaLiteType.type.flags, prefix);
    return curVegaLiteType;
}

function convertLiteralToString(value: string | number | ts.PseudoBigInt): string {
    if (typeof value === 'string') {
      return value;
    } else {
      return value.toString();
    }
}


const api_const = {
    "TopLevelUnitSpec": ["mark", "data"], // TODO: specific mark
    "TolevelFacetSpec": ["_Facet"],
    "TopLevel<LayerSpec>": ["layer"],
    "TopLevel<GenericConcatSpec>": ["concat"],
    "TopLevel<RepeatSpec>": ["_Repeat"],
    "TopLevel<GenericVConcatSpec>": ["vconcat"],
    "TopLevel<GenericHConcatSpec>": ["hconcat"],
    // "TopLevel<GenericSpec>": ["spec"],
    "UrlData": ["urlData"],
    "InlineData": ["inlineData"],
    "NamedData": ["namedData"],
    "SequenceParams": ["sequence"],
    "CsvDataFormat": ["csv"],
    "DsvDataFormat": ["dsv"],
    "JsonDataFormat": ["json"],
    "TopoDataFormat": ["topojson"],
    // "FacetEncodingFieldDef<Field, any>": [] // TODO: specific encoidng
    // ["SphereGenerator"],
    // ["GraticuleGenerator"]
};

function generate() {
    const entries = Object.entries(api_const);

    for (const [key, value] of entries) {
        const vegaLiteType = VegaLiteTypeMap.get(key);
        if (vegaLiteType !== undefined) {
            for (const className of value) {
                const classType = VegaLiteTypeMap.get(className)!;
                generateForEach(vegaLiteType, className, classType);
            }
        }
    }
}

function generateForEach(propertyType: VegaLiteType, methodName: string, classType: VegaLiteType) {
    if (methodName.startsWith('$')) return;
    const className = capitalize(methodName);

    // generate class
    const emit = emitter('__util__');
    emit.import(['BaseObject']);
    emit(`class ${className} extends BaseObject {`);
    emit().indent();

    // const argTypes = findArgTypes(type);
    const argType = classType !== undefined && classType.oneLevelType.length > 0 ? `: ${classType.oneLevelType}` : '';
    // -- constructor --
    emit(`constructor(...args${argType}) {`).indent();
    emit(`super();`);
    emit.import(['init']);
    emit(`init(this);`);
    // emit.import(['get', 'set', 'merge', 'isString']);
    // emit(`set(this, ${methodName}, merge(0, get(this, "${methodName}"), args));`);
    emit.outdent();
    emit(`}`);
    emit();
    
    // -- properties --
    const properties = propertyType.properties;
    // const compareByName = (a:ts.Symbol, b: ts.Symbol) => a.name < b.name ? -1 : 1;
    // properties.sort(compareByName);
    for (const property of properties) {
        const prop = property.name;
        if (prop.startsWith("$")) continue;

        emit.import(['copy', 'get', 'set']);
        emit(`${prop}(${''}value: ${property.oneLevelType}) {`).indent();
        emit(  `if (arguments.length) {`).indent();
        emit(    `const obj = copy(this);`);
        emit(    `set(obj, "${prop}", value);`);
        emit(    `return obj;`).outdent();
        emit(  `} else {`).indent();
        emit(    `return get(this, "${prop}");`).outdent();
        emit(  `}`).outdent();
        emit(`}`);
        emit();
    }
    emit.outdent()
    emit(`}`);
    emit();

    // -- exports --
    emit(`export function ${methodName}(...args${argType}) {`);
    emit(`  return new ${className}(...args);`);
    emit(`}`);

    // console.log(emit.code());
    const fileName = `./generated/${methodName}.ts`;
    writeFile(fileName, emit.code());
}


function generateClass (type:ts.Type, node: ts.TypeReferenceNode) {
    switch (checker.typeToString(type)) {
        case "TopLevelUnitSpec<Field>":
            emitTopLevelType(type, node, "mark");
            emitTopLevelType(type, node, "data");
            break;
        case "TopLevelFacetSpec":
            emitTopLevelType(type, node, "_Facet");
            break;
        case "TopLevel<LayerSpec<Field>>":
            emitTopLevelType(type, node, "layer");
            break;
        case "TopLevel<GenericConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, node, "concat");
            break;
        case "TopLevel<RepeatSpec>":
            emitTopLevelType(type, node, "_Repeat");
            break;
        case "TopLevel<GenericVConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, node, "vconcat");
            break;
        case "TopLevel<GenericHConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, node, "hconcat");
            break;
    }
}


function getBottomType(type: ts.Type): ts.Type {
    const nonNullableType = checker.getNonNullableType(type);
    if (nonNullableType.flags & ts.TypeFlags.Object & ts.ObjectFlags.Reference) {
        const typeReference = nonNullableType as ts.TypeReference;
        if (typeReference.target) {
            return getBottomType(typeReference.target);
        }
    }
    return nonNullableType;
}

function emitTopLevelType(type: ts.Type, node: ts.TypeReferenceNode, methodName: string): void {
    if (methodName.startsWith('$')) return;
    const className = capitalize(methodName);

    // generate class
    const emit = emitter('__util__');
    emit.import(['BaseObject']);
    emit(`class ${className} extends BaseObject {`);
    emit().indent();

    // const argTypes = findArgTypes(type);
    const argTypes = "";
    // -- constructor --
    emit(`constructor(...args) {`).indent();
    emit(`super();`);
    emit.import(['init']);
    emit(`init(this);`);
    emit.import(['get', 'set', 'merge', 'isString']);
    emit(`set(this, ${methodName}, merge(0, get(this, "${methodName}"), args));`);
    emit.outdent();
    emit(`}`);
    emit();
    
    // -- properties --
    const properties = type.getProperties();
    const compareByName = (a:ts.Symbol, b: ts.Symbol) => a.name < b.name ? -1 : 1;
    properties.sort(compareByName);
    for (const property of properties) {
        const prop = property.name;
        if (prop.startsWith("$")) continue;

        // get type of properties
        // const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        // TODO: complete the convertion to bottom type
        const visited = new Map<string, string>();
        const propertyTypeName = getBottomPropertyType(propertyType, visited);
        emit.import(['copy', 'get', 'set']);
        // emit(`${prop}(${''}value: ${propertyTypeName}) {`).indent(); 
        emit(`${prop}(${''}value: ${checker.typeToString(propertyType)}) {`).indent();
        emit(  `if (arguments.length) {`).indent();
        emit(    `const obj = copy(this);`);
        emit(    `set(obj, "${prop}", value);`);
        emit(    `return obj;`).outdent();
        emit(  `} else {`).indent();
        emit(    `return get(this, "${prop}");`).outdent();
        emit(  `}`).outdent();
        emit(`}`);
        emit();
    }
    emit.outdent()
    emit(`}`);
    emit();

    // -- exports --
    emit(`export function ${methodName}(...args) {`);
    emit(`  return new ${className}(...args);`);
    emit(`}`);

    // console.log(emit.code());
    const fileName = `./generated/${methodName}.ts`;
    writeFile(fileName, emit.code());
}


function getBottomPropertyType(type: ts.Type, visited: Map<string, string>): string {
    // const typeName = type.symbol ? type.symbol.name : "";
    const typeString = checker.typeToString(type);

    var returnString = typeString;

    if (visited.has(typeString)) {
      return visited.get(typeString)!; // TODO: deal with recursion later e.g.LogicalNot<T>
    }
    visited.set(typeString, "");

    switch (type.flags) {
        case ts.TypeFlags.Any:
        case ts.TypeFlags.String:
        case ts.TypeFlags.Number:
        case ts.TypeFlags.Boolean:
        case ts.TypeFlags.StringLiteral:
        case ts.TypeFlags.NumberLiteral:
        case ts.TypeFlags.BooleanLiteral:
            returnString = typeString;
            break;
        case ts.TypeFlags.Union:
            const unionType = type as ts.UnionType;
            const types = unionType.types;
            const bottomTypes = types.map(t => getBottomPropertyType(t, visited));
            returnString = bottomTypes.join(" | ");
            break;
        case ts.TypeFlags.Intersection:
            const intersectionType = type as ts.IntersectionType;
            const intersectionTypes = intersectionType.types;
            const bottomIntersectionTypes = intersectionTypes.map(t => getBottomPropertyType(t, visited));
            returnString = bottomIntersectionTypes.join(" & ");
            break;
        case ts.TypeFlags.Object:
            visited.delete(typeString);
            returnString = getBottomObjectType(type as ts.ObjectType, visited);
            break;
    }
    visited.set(typeString, returnString);
    return returnString;
}

function getBottomObjectType(type: ts.ObjectType, visited: Map<string, string>): string {
    const typeString = checker.typeToString(type);

    var returnString = typeString;

    if (visited.has(typeString)) {
      return visited.get(typeString)!; // TODO: deal with recursion later e.g.LogicalNot<T>
    }

    visited.set(typeString, "");
    
    const properties = type.getProperties();
    const propertyTypes = properties.map(property => {
        if (property.valueDeclaration !== undefined) {
            // console.log(property.name);
            const propertyType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration);
            //TODO: optional or not
            const isOptional = false;
            const propertyTypeString = getBottomPropertyType(propertyType, visited);
            return `${property.name}${isOptional ? '?' : ''}: ${propertyTypeString}`;
        }
        return property.name;
    });
    returnString = `{${propertyTypes.join(", ")}}`;


    // switch (type.objectFlags) {
    //     case ts.ObjectFlags.Class:
    //     case ts.ObjectFlags.Interface:
    //     case ts.ObjectFlags.ClassOrInterface:
    //     case ts.ObjectFlags.Anonymous:
    //         const properties = type.getProperties();
    //         const propertyTypes = properties.map(property => {
    //             if (property.valueDeclaration !== undefined) {
    //                 // console.log(property.name);
    //                 const propertyType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration);
    //                 //TODO: optional or not
    //                 const isOptional = false;
    //                 const propertyTypeString = getBottomPropertyType(propertyType, visited);
    //                 return `${property.name}${isOptional ? '?' : ''}: ${propertyTypeString}`;
    //             }
    //             return property.name;
    //         });
    //         returnString = `{${propertyTypes.join(", ")}}`;
    //         break;
    //     case ts.ObjectFlags.Reference:
    //         // TODO: deal with reference
    //         returnString = typeString;
    //         break;
    //     default:
    //         returnString = typeString;
    //         console.log("!!!!!!!unknown object type", type.objectFlags);
    // }

    visited.set(typeString, returnString);
    return returnString;
}

function isPropertyOptional(property: ts.Symbol): boolean {
    const declarations = property.getDeclarations();
  
    if (declarations) {
      for (const declaration of declarations) {
        if (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) {
          return declaration.questionToken !== undefined;
        }
      }
    }

    return false;
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function writeFile(fileName: string, content: string): void {
    fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log(`Successfully wrote to ${fileName}`);
        }
    });
}

console.log(objectFlagSet);
console.log(flagSet);
generate();