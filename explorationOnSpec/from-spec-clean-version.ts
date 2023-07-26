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

const visitedTypes = new WeakSet<ts.Node|ts.Type>();

// main process
const specNode = findTopLevelSpec(sourceFile);
if (ts.isUnionTypeNode(specNode)) {
    const types = specNode.types;
    for(const type of types) {
        if(ts.isTypeReferenceNode(type)) {
            console.log("###############", type.getText(),"###############");
            findType(type, 1);
        }
    }
}

// find TopLevelSpec
function findTopLevelSpec(sourceFile: ts.SourceFile): ts.UnionTypeNode {
    for (const statement of sourceFile.statements) {
        if (ts.isTypeAliasDeclaration(statement) && statement.name.getText() === "TopLevelSpec"){
            console.log(statement.name.getText());
            if(ts.isUnionTypeNode(statement.type)) {
                return statement.type;
            }  
        }
    }
    throw new Error("TopLevelSpec not found");
}

// recursively get types and their properties
function findType(node: ts.TypeNode, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    if (ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            const type = checker.getTypeAtLocation(node);

            generateClass(type, node);

            console.log(prefix, checker.typeToString(type));
            const properties = type.getProperties();
            for (const property of properties) {
                const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
                // console.log(prefix+"@@propertyType:", checker.typeToString(propertyType));
                console.log(prefix+"@property:", property.name, "type:", checker.typeToString(propertyType));
                if (!visitedTypes.has(propertyType)) {
                    visitedTypes.add(type);
                    findFromType(propertyType, depth+1);
                } 
            }

            if(node.typeArguments) {
                for(const typeArgument of node.typeArguments) {
                    if (!visitedTypes.has(typeArgument)) {
                        visitedTypes.add(typeArgument);
                        findType(typeArgument, depth + 1);
                    }
                }
            }
        }
    } else {
        console.log(prefix+"not referenceNode", node.getText());
    }
    // ts.forEachChild(node, findType);
}

function findFromType(type: ts.Type, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    console.log(prefix+"findFromType:", checker.typeToString(type));

    if (!visitedTypes.has(type)) {
        visitedTypes.add(type);
    } else {
        return;
    }

    const tp_properties = (type as any).properties;
    if (tp_properties) {
        for (const tp_property of tp_properties) {
            console.log(prefix+"@@property", tp_property.name, ":", checker.typeToString(tp_property));
        }
    }
    
    if (type.isUnion()) {
        const types = type.types;
        for (const tp of types) {
            console.log(prefix+"@UnionTypes:", checker.typeToString(tp));
        }
        for (const tp of types) {
            findFromType(tp, depth+1);
        }
    } else if (type.isIntersection()) {
        const types = type.types;
        for (const tp of types) {
            console.log(prefix+"@IntersectionTypes:", checker.typeToString(tp));
        }
        for (const tp of types) {
            findFromType(tp, depth+1);
        }
    }
    else if (type.isLiteral()) {
        console.log(prefix+"@literal:", type.value);
    }
    else if (type.isTypeParameter()) {
        console.log(prefix+"@typeParameter", type.symbol.getEscapedName());
    }
    const tp_node = (type as any).node;
    if (tp_node) {
        if (!visitedTypes.has(type)) {
            visitedTypes.add(type);
            findType(tp_node, depth + 1);
        }
    }
}

function generateClass (type:ts.Type, node: ts.TypeReferenceNode) {
    switch (checker.typeToString(type)) {
        case "TopLevelUnitSpec<Field>":
            emitTopLevelType(type, "mark");
            emitTopLevelType(type, "data");
            break;
        case "TopLevelFacetSpec":
            emitTopLevelType(type, "_facet");
            break;
        case "TopLevel<LayerSpec<Field>>":
            emitTopLevelType(type, "layer");
            break;
        case "TopLevel<GenericConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, "concat");
            break;
        case "TopLevel<RepeatSpec>":
            emitTopLevelType(type, "_repeat");
            break;
        case "TopLevel<GenericVConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, "vconcat");
            break;
        case "TopLevel<GenericHConcatSpec<NonNormalizedSpec>>":
            emitTopLevelType(type, "hconcat");
            break;
    }
}

function emitTopLevelType(type: ts.Type, methodName: string): void {
    if (methodName.startsWith('$')) return;
    const className = capitalize(methodName);

    // generate class
    const emit = emitter('__util__');
    emit.import(['BaseObject']);
    emit(`class ${className} extends BaseObject {`);
    emit().indent();

    const argTypes = findArgTypes(type);
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
        emit.import(['copy', 'get', 'set']);

        emit(`${prop}(${''}value) {`).indent();
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

function findArgTypes(type: ts.Type) {

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