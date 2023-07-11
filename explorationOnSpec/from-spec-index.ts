import * as ts from "typescript";

const sourceFiles = ["vega-lite-src/spec/index.ts"];
let program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let checker = program.getTypeChecker();

const sourceFile = program.getSourceFile("vega-lite-src/spec/index.ts")!;

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
                // begin from TopLevelSpec
                if(statement.name.getText() === "TopLevelSpec") {
                    console.log(statement.name.getText());
                    const symbol = checker.getSymbolAtLocation(statement.name);
                    const typeSymbol = checker.getSymbolAtLocation(statement.type!);
                    if(ts.isUnionTypeNode(statement.type)) {
                        const types = statement.type.types;
                        for(const type of types) {
                            if(ts.isTypeReferenceNode(type)) {
                                console.log("###############", type.getText(),"###############");
                                // one is to get types, the other is to get the properties
                                findType(type);
                                findProperties(type);
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

// traverse the type
function findType(node: ts.Node) {
    if (ts.isTypeNode(node) && ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            const type = checker.getTypeAtLocation(node);
            console.log("#######", checker.typeToString(type), "#######");
            // recursively find the real type
            findBottomType(type, 1);
        }
    }
    ts.forEachChild(node, findType);
}

// recurse to find the bottom type
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
        // TODO: "type.resolvedTypeArguments" have inherietance information, but can't access it
        // this may be helpful: https://stackoverflow.com/questions/53596095/typescript-compiler-api-accessing-resolved-type-of-this-parameter
        console.log(prefix, checker.typeToString(type));
    }
}

// traverse the properties
function findProperties(node: ts.Node) {
    if (ts.isTypeNode(node) && ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        if (symbol) {
            const type = checker.getTypeAtLocation(node);
            console.log("#######", checker.typeToString(type), "#######");
            const properties = type.getProperties();
            for(const property of properties) {
                console.log("###", property.name, "###",);
                const propertyType = checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!);
                if(propertyType){
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

// recurse to find the property of each type
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
