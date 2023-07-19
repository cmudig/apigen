import { stat } from "fs";
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

for (const statement of sourceFile.statements) {
    switch (statement.kind) {
        case ts.SyntaxKind.ImportDeclaration:
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            if(ts.isInterfaceDeclaration(statement)) {
                if(statement.name.getText() === "BaseViewBackground") {
                    const symbol = checker.getSymbolAtLocation(statement.name);
                    const types = checker.getTypeAtLocation(statement.name);
                    if(symbol) {
                        const interfaceDeclaration = symbol.declarations?.[0] as ts.InterfaceDeclaration;
                        // const type = checker.getDeclaredTypeOfSymbol(symbol!);

                        if (types.isClassOrInterface()) {
                            const heritageClauses = interfaceDeclaration.heritageClauses;
                            if (heritageClauses && heritageClauses.length > 0) {
                                const heritageClause = heritageClauses[0];
                                const typeNode = heritageClause.types[0];
                                const typeArguments = typeNode.typeArguments;
                                if (typeArguments && typeArguments.length > 0) {
                                    const pickConfigTypeNode  = typeArguments[0];
                                    const tp = checker.getTypeAtLocation(pickConfigTypeNode);
                                    console.log(tp);
                                    // I can't get the type of the typeArguments
                                    // const pickConfigTypeNode = pickConfigNode.typeArguemnts?.[0];
                                    // const pickArguments = pickConfigTypeNode.typeArguments[0].;
                                    // if (pickArguments && pickArguments.length > 0) {

                                    // }
                                    // const pickConfigArguments = pickConfigTypeNode.typeArguments;
                                    console.log(pickConfigTypeNode.getText());
                                }
                            }
                        }
                    }


                    // const mark = symbol?.declarations[0].heritageClauses?.[0].types[0].typeArguments?.[0].typeArguments?.[0];
                    // // const baseTypes = checker.getBaseTypes(type);
                    // // console.log(baseTypes);
                    const properties = types.getProperties();
                    for(const property of properties) {
                        console.log(property.name);
                        // fill
                        // stroke
                        // cursor
                        // cornerRadius
                        // fillOpacity
                        // opacity
                        // strokeCap
                        // strokeDash
                        // strokeDashOffset
                        // strokeJoin
                        // strokeMiterLimit
                        // strokeOpacity
                        // strokeWidth
                    }
                    console.log("###############");
                    // console.log(symbol);
                }
            }
            break;
        case ts.SyntaxKind.TypeAliasDeclaration:
            if(ts.isTypeAliasDeclaration(statement)) {
                if(statement.name.getText() === "TopLevelSpec") {
                    console.log(statement.name.getText());
                    const symbol = checker.getSymbolAtLocation(statement.name);
                    const typeSymbol = checker.getSymbolAtLocation(statement.type!);
                    if(ts.isUnionTypeNode(statement.type)) {
                        const types = statement.type.types;
                        for(const type of types) {
                            if(ts.isTypeReferenceNode(type)) {
                                console.log("###############", type.getText(),"###############");
                                findType(type, 1);
                                // findProperties(type);
                            }
                        }
                    }
                }
            }
            break;
        case ts.SyntaxKind.ExportDeclaration:
            break;
        case ts.SyntaxKind.VariableStatement:
            break;
        case ts.SyntaxKind.FunctionDeclaration:
            break;
        default:
            console.log(statement.kind);
            break;
    }
}

function findType(node: ts.Node, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    if (ts.isTypeNode(node) && ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            // const type = checker.getDeclaredTypeOfSymbol(symbol);
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
                // const propertyType = checker.getTypeOfPropertyOfType(type, property.name)
                const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
                console.log(prefix+"@@propertyType:", checker.typeToString(propertyType));
            }
            // findBottomType(type, 1);
            if (type.isUnion() || type.isIntersection()) {
                const types = type.types;
                for (const tp of types) {
                    console.log(prefix+"@type:", checker.typeToString(tp));
                    if (tp.isLiteral()){
                        console.log(prefix+"@literal:", tp.value);
                    } else if (tp.isIntersection()) {
                        for (const sub_tp of tp.types) {
                            if(!visitedTypes.has(sub_tp)) {
                                visitedTypes.add(sub_tp);
                            }
                            console.log(prefix+"@subTypes:", checker.typeToString(sub_tp));
                        }
                    } else if (tp.isTypeParameter()) {
                        console.log(prefix+"@typeParameter", tp.symbol.getEscapedName());
                    } else {
                        const tp_properties = (tp as any).properties;
                        if (tp_properties) {
                            for (const tp_property of tp_properties) {
                                console.log(prefix+"@@property", tp_property.name);
                            }
                        }
                        const tp_node = (tp as any).node;
                        if (tp_node) {
                            if (!visitedTypes.has(tp)) {
                                visitedTypes.add(tp);
                                findType(tp_node, depth + 1);
                            }
                        }
                    }
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
    }
    // ts.forEachChild(node, findType);
}

function findBottomType(type: ts.Type, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    if(type.isUnion() || type.isIntersection()) {
        const types = type.types;
        console.log(prefix, checker.typeToString(type));
        for(const tp of types) {
            findBottomType(tp, depth+1);
        }
    } else if(type.isClassOrInterface()){
        console.log(prefix, checker.typeToString(type));
        // type.typeParameters?.forEach((typeParameter) => {
        //     console.log(prefix, typeParameter.symbol.name);
        // });
    } else {
        //TODO: "type.resolvedTypeArguments" have inherietance information, but can't access it
        // this may be helpful: https://stackoverflow.com/questions/53596095/typescript-compiler-api-accessing-resolved-type-of-this-parameter
        console.log(prefix, checker.typeToString(type));
    }
}

function findProperties(node: ts.Node) {
    if (ts.isTypeNode(node) && ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            // const type = checker.getDeclaredTypeOfSymbol(symbol);
            const type = checker.getTypeAtLocation(node);
            console.log("#######", checker.typeToString(type), "#######");
            const properties = type.getProperties();
            for(const property of properties) {
                console.log("###", property.name, "###",);
                const propertyType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
                if(propertyType){
                    // findBottomProperty(propertyType, 1);
                    if(propertyType.isUnion() || propertyType.isIntersection()) {
                        const types = propertyType.types;
                        console.log(checker.typeToString(propertyType));
                        for(const tp of types) {
                            // findBottomProperty(tp, 1);
                            console.log(checker.typeToString(tp));
                        }
                    }
                }
            }
        }
    }
    ts.forEachChild(node, findProperties);
}

function findBottomProperty(type: ts.Type, depth: number) {
    const prefix:string = new Array(depth).fill("-").join("");
    // console.log(prefix, "@type", checker.typeToString(type));
    const properties = type.getProperties();
    for(const property of properties) {
        console.log(prefix, property.name);
        const propertyType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
        if(propertyType){
            // console.log(prefix, checker.typeToString(type));
            findBottomProperty(propertyType, depth+1);
        }
    }
    if(type.isUnion() || type.isIntersection()) {
        const types = type.types;
        // console.log(prefix, checker.typeToString(type), prefix);
        for(const tp of types) {
            findBottomProperty(tp, depth+1);
        }
    }
}