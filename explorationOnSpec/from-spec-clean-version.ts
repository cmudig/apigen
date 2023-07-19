import * as ts from "typescript";
import { emitter } from './generate-util';


const sourceFiles = ["vega-lite-src/spec/index.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("vega-lite-src/spec/index.ts")!;

const visitedTypes = new WeakSet<ts.Node|ts.Type>();

// find TopLevelSpec
for (const statement of sourceFile.statements) {
    if (ts.isTypeAliasDeclaration(statement) && statement.name.getText() === "TopLevelSpec"){
        console.log(statement.name.getText());
        if(ts.isUnionTypeNode(statement.type)) {
            const types = statement.type.types;
            for(const type of types) {
                console.log("###############", type.getText(),"###############");
                if(ts.isTypeReferenceNode(type)) {
                    findType(type, 1);
                }
            }
        }  
    }
}

// recursively get types and their properties
function findType(node: ts.Node, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    if (ts.isTypeNode(node) && ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            const type = checker.getTypeAtLocation(node);
            if (!visitedTypes.has(type)) {
                visitedTypes.add(type);
            } 

            // generate mark
            if (checker.typeToString(type) === "TopLevelUnitSpec<Field>") {
                var passProps = ["mark", "encoding", "projection"];
                const methodName = "mark";
                const className = "Mark";

                // generate class
                const emit = emitter('__util__');
                emit.import(['BaseObject']);
                emit(`class ${className} extends BaseObject {`);
                emit().indent();

                // -- constructor --
                emit(`constructor(...args) {`).indent();
                emit(`super();`);
                emit.import(['init']);
                emit(`init(this);`);
                const arg = ["...mark"];
                emit.import(['get', 'set', 'merge', 'isString']);
                emit(`args = args.map(_ => isString(_) ? {type: _} : _);`);
                emit(`set(this, "mark", merge(0, get(this, "mark"), args));`);
                // const type = [{String: {key: 'type'}}];
                // if (type) emit(`args = args.map(_ => ${typeSwitch(emit, type, '_')});`);
                // emit(`set(this, ${$(_.slice(3))}, merge(0, get(this, ${$(_.slice(3))}), args));`);
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

                console.log(emit.code());
            }

            console.log(prefix, checker.typeToString(type));
            const properties = type.getProperties();
            for (const property of properties) {
                console.log(prefix+"@property:", property.name);
                const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
                console.log(prefix+"@@propertyType:", checker.typeToString(propertyType));
            }
            findFromType(type, depth);

            if(node.typeArguments) {
                for(const typeArgument of node.typeArguments) {
                    if (!visitedTypes.has(typeArgument)) {
                        visitedTypes.add(typeArgument);
                        findType(typeArgument, depth + 1);
                    }
                }
            }
        }
    }
    // ts.forEachChild(node, findType);
}

function findFromType(type: ts.Type, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    console.log(prefix+"findFromType:", checker.typeToString(type));
    const tp_properties = (type as any).properties;
    if (tp_properties) {
        for (const tp_property of tp_properties) {
            console.log(prefix+"@@property", tp_property.name);
            console.log(prefix+"@@propertyType:", checker.typeToString(tp_property));
        }
    }
    
    if (type.isUnion() || type.isIntersection()) {
        const types = type.types;
        for (const tp of types) {
            if(!visitedTypes.has(tp)) {
                visitedTypes.add(tp);
            }
            // console.log(prefix+"@subTypes:", checker.typeToString(tp));
            findFromType(tp, depth+1);
        }
    } 
    else if (type.isLiteral()) {
        console.log(prefix+"@literal:", type.value);
    }
    // else if (type.isIntersection()) {
    //     for (const sub_tp of type.types) {
    //         if(!visitedTypes.has(sub_tp)) {
    //             visitedTypes.add(sub_tp);
    //         }
    //         console.log(prefix+"@subTypes:", checker.typeToString(sub_tp));
    //     }
    // }
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