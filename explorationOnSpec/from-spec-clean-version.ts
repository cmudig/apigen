import * as ts from "typescript";
import fs from 'fs';
import { emitter } from './generate-util';
const CHECK_DUPLICATE = false;

/**********************************
 *  Internal Representation 
 * ********************************/
interface baseType {
    name: string;
    type: ts.Type;
    descirption?: string;
}

class Property implements baseType{
    name: string;
    type: ts.Type;
    optional: boolean;
    sourceFile: string = "";
    constructor(name: string, type: ts.Type, optional: boolean, sourceFile?: string | undefined) {
        this.name = name;
        this.type = type;
        this.optional = optional;
        if(sourceFile !== undefined) { this.sourceFile = sourceFile; }
    }
}

class vegaType implements baseType{
    name: string;
    type: ts.Type;
    properties: Property[];
    sourceFile: string = "";
    constructor(name: string, type: ts.Type, properties: Property[], sourceFile?: string | undefined) {
        this.name = name;
        this.type = type;
        this.properties = properties;
        if(sourceFile !== undefined) { this.sourceFile = sourceFile; }
    }
}

/**********************************
 *  Generate Step 1: Traverse Types and Build Internal Representation
 * ********************************/
// create program and typechecker
const sourceFiles = ["vega-lite-src/spec/index.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();
const sourceFile = program.getSourceFile("vega-lite-src/spec/index.ts")!;

// check if type is visited
const visitedTypes: ts.Type[] = [];
const flagSet = new Set();
const typeList: vegaType[] = [];

// find TopLevelSpec and start from it
const specNode = findTopLevelSpec(sourceFile);
if (ts.isUnionTypeNode(specNode)) {
    const types = specNode.types;
    for(const type of types) {
        if(ts.isTypeReferenceNode(type)) {
            findFromType(checker.getTypeAtLocation(type));
        }
    }
}

/**
 * Traverse type and get Internal Representation
 * @param type types in souce file
 */
function findFromType(type: ts.Type) {
    flagSet.add(type.flags);
    if (visitedTypes.includes(type)) {
        return;
    }
    visitedTypes.push(type);
    const name = checker.typeToString(type);

    // deal with properties
    const props = checker.getPropertiesOfType(type);
    const propList: Property[] = [];
    for (const prop of props) {
        if (prop.name.startsWith("__") || prop.name.startsWith("$")) {
            continue;
        }
        // if (prop.valueDeclaration && ts.isPropertySignature(prop.valueDeclaration) && prop.valueDeclaration.type && ts.isTypeReferenceNode(prop.valueDeclaration.type)) {
        if (prop.valueDeclaration !== undefined) {
            const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!);
            const propName = prop.getName();
            const optional = prop.valueDeclaration && ts.isPropertySignature(prop.valueDeclaration) && prop.valueDeclaration.questionToken;
            const srcFile = getSrcFile(propType);
            propList.push(new Property(propName, propType, !!optional, srcFile));
            if (!propType.isLiteral()) {
                findFromType(propType);  //TODO: there are many repeated types such as () => string (set CHECK_DUPLICATE = true; and see)
            }
        } else {
            // console.log("no value declaration for " + prop.getName());
        }
    }
    const sourceFile = getSrcFile(type);
    const typeObj = new vegaType(name, type, propList, sourceFile);
    typeList.push(typeObj);
    UnionIntersectionHandler(type);
    getSrcFile(type);
}

function UnionIntersectionHandler(type: ts.Type) {
    if (type.isUnion() || type.isIntersection()) {
        const types = type.types;
        for (const type of types) {
            findFromType(type);
        }
    }
}

console.log(flagSet);


/**********************************
 *  Generate Step 2: Generate Code from Internal Representation
 * ********************************/
// TODO: use the json-schema generator's logic to simplify type name
const api_const = {
    "TopLevelUnitSpec<Field>": ["mark", "data"], // TODO: specific mark
    "TolevelFacetSpec": ["_Facet"],
    "TopLevel<LayerSpec<Field>>": ["layer"],
    "TopLevel<GenericConcatSpec<NonNormalizedSpec>>": ["concat"],
    "TopLevel<RepeatSpec>": ["_Repeat"],
    "TopLevel<GenericVConcatSpec<NonNormalizedSpec>>": ["vconcat"],
    "TopLevel<GenericHConcatSpec<NonNormalizedSpec>>": ["hconcat"],
    // "TopLevel<GenericSpec>": ["spec"],
    "UrlData": ["urlData"],
    "InlineData": ["inlineData"],
    "NamedData": ["namedData"],
    // "SequenceParams": ["sequence"],
    "CsvDataFormat": ["csv"],
    "DsvDataFormat": ["dsv"],
    "JsonDataFormat": ["json"],
    "TopoDataFormat": ["topojson"],
    // "FacetEncodingFieldDef<Field, any>": [] // TODO: specific encoidng
    // ["SphereGenerator"],
    // ["GraticuleGenerator"]
};

// create type name map
const typeNameMap = new Map<string, vegaType>();
for (const type of typeList) {
    typeNameMap.set(type.name, type);
}
generate();

// traverse the const and generate code
function generate() {
    const entries = Object.entries(api_const);

    for (const [key, value] of entries) {
        const vegaLiteType = typeNameMap.get(key);
        if (vegaLiteType !== undefined) {
            for (const className of value) {
                const classType = typeNameMap.get(className)!;
                generateForEach(className, classType, vegaLiteType);
            }
        }
    }
}

/**
 * Generate code for each class.
 * @param propertyType 
 * @param methodName 
 * @param classType 
 * @returns 
 */
function generateForEach(methodName: string, classType: vegaType, propertyType: vegaType) {
    if (methodName.startsWith('$')) return;
    const className = capitalize(methodName);

    // generate class
    const emit = emitter('./__util__');
    emit.import(['BaseObject']);
    emit(`class ${className} extends BaseObject {`);
    emit().indent();

    // const argTypes = findArgTypes(type);
    const argType = classType === undefined? "" : `: ${classType.name}`;
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
    for (const prop of properties) {
        const propName: string = prop.name;
        const valueType: string = checker.typeToString(prop.type);
        // deal with import
        importVegaLiteType(emit, prop.type);

        // valueTypeObj === undefined ?  : undefined;
        // emit.import([valueType], getSourceFile(prop.type));
        // if (prop.startsWith("$")) continue;

        emit.import(['copy', 'get', 'set']);
        emit(`${propName}(${''}value: ${valueType}) {`).indent();
        emit(  `if (arguments.length) {`).indent();
        emit(    `const obj = copy(this);`);
        emit(    `set(obj, "${propName}", value);`);
        emit(    `return obj;`).outdent();
        emit(  `} else {`).indent();
        emit(    `return get(this, "${propName}");`).outdent();
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

/**
 * Import vega-lite type in the generated file.
 * @param emit emitter to generate the code
 * @param type type to import
 */
function importVegaLiteType(emit: any, type: ts.Type) {
    const typeObj = typeNameMap.get(checker.typeToString(type));
    switch (type.flags) {
        case ts.TypeFlags.StringLiteral:
        case ts.TypeFlags.String:
        case ts.TypeFlags.Number:
        case ts.TypeFlags.Boolean:
        case ts.TypeFlags.Null:
            return;
        case ts.TypeFlags.Union:
        case ts.TypeFlags.Intersection:
            if (typeObj !== undefined && typeObj.sourceFile !== "") break;
            const types = (type as ts.UnionType).types;
            for (const type of types) {
                importVegaLiteType(emit, type);
            }
            return;
        case ts.TypeFlags.Object:
            const typeString: string = checker.typeToString(type);
            if (typeString.startsWith("{") && typeString.endsWith("}")) return;
            if (typeString.includes("<")){
                // get typeParameter
                const para = typeString.match(/<([^>]*)>/);
                if (para) {
                    const paraObj = typeNameMap.get(para[1]);
                    if (paraObj !== undefined && paraObj.sourceFile !== "") {
                        emit.import([paraObj.name], paraObj.sourceFile);
                    }
                }
                console.log(typeString);
            }
            break;
        default:
            console.log("undealt", type.flags, checker.typeToString(type));
    }
    if (typeObj !== undefined && typeObj.sourceFile !== "") {
        const importName = typeObj.name.replace(/<.*?>/g, '').replace(/\[\]$/, '');
        emit.import([importName], typeObj.sourceFile);
    }
}

/**********************************
 *  Generate Utils
 * ********************************/
/**
 * Find TopLevelSpec in source file.
 * @param sourceFile vega-lite src/index.ts
 * @returns the union type node of TopLevelSpec
 */
function findTopLevelSpec(sourceFile: ts.SourceFile): ts.UnionTypeNode {
    for (const statement of sourceFile.statements) {
        if (ts.isTypeAliasDeclaration(statement) && statement.name.getText() === "TopLevelSpec"){
            if(ts.isUnionTypeNode(statement.type)) {
                return statement.type;
            }  
        }
    }
    throw new Error("TopLevelSpec not found");
}

/**
 * Get the source file path of a type.
 * @param type vega-lite type
 * @returns file path string if found, undefined otherwise
 */
function getSrcFile(type: ts.Type): string | undefined {
    if (type.aliasSymbol !== undefined && type.aliasSymbol.declarations !== undefined) {
        const filePath = type.aliasSymbol.declarations[0].getSourceFile().fileName;
        return convertFilePath(filePath);
    }
    const symbol = type.getSymbol();
    if (symbol) {
        const declarations = symbol.getDeclarations();
        if (declarations) {
            const declaration = declarations[0];
            const sourceFile = declaration.getSourceFile();
            if (sourceFile) {
                return convertFilePath(sourceFile.fileName);
            }
        }
    }
    return undefined;
}

/**
 * Convert local file path to module file path so that it can be correctly imported in the generated file.
 * @param filePath original local file path
 * @returns e.g. "vega-lite/src/mark"
 */
function convertFilePath(filePath: string): string {
    const vegaLiteKeyword = "vega-lite-src";
    var startIndex = filePath.indexOf(vegaLiteKeyword);
    if (startIndex !== -1) {
        const file = filePath.substring(startIndex + vegaLiteKeyword.length + 1).slice(0, -3);
        return `vega-lite/src/${file}`;
    }
    const vegaTypeKeyworkd = "vega-typings";
    startIndex = filePath.indexOf(vegaTypeKeyworkd);
    if (startIndex !== -1) {
        const file = filePath.substring(startIndex + vegaTypeKeyworkd.length + 1).slice(0, -3);
        return `vega-typings/${file}`;
    }
    return filePath;
}

/**
 * Capitalize the first letter of a string.
 * @param str 
 * @returns capitalized string
 */
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Write content to a file.
 * @param fileName 
 * @param content 
 */
function writeFile(fileName: string, content: string): void {
    fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log(`Successfully wrote to ${fileName}`);
        }
    });
}

/**********************************
 *  Test Usage: Find Duplicate Names in the Type List
 * ********************************/
function hasDuplicateNames(typeList: vegaType[]): vegaType[] {
    const nameSet = new Set();
    const duplicateTypes: vegaType[] = [];

    for (const vegaType of typeList) {
        if (nameSet.has(vegaType.name)) {
            duplicateTypes.push(vegaType);
        }
        nameSet.add(vegaType.name);
    }

    return duplicateTypes;
}

if (CHECK_DUPLICATE) {
    const duplicateNamesExist = hasDuplicateNames(typeList);
    console.log('Type list length:', typeList.length);
    console.log('Duplicate length:', duplicateNamesExist.length);
    // console.log('Duplicate names exist:', duplicateNamesExist);
    for (const type of duplicateNamesExist) {
        console.log(type.name);
    }
}