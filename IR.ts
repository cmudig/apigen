import * as ts from "typescript";

export type typePrimitive = string | number;
export type typeComplex = ts.SyntaxKind.UnionType | ts.SyntaxKind.LiteralType;
export type typeKind = ts.SyntaxKind.InterfaceDeclaration | ts.SyntaxKind.TypeAliasDeclaration;
export type typeType = typePrimitive | typeComplex ;

export class ASTStatement {
    public node: ts.Node;
    public name: string;
    public kind?: typeKind; 
    public type?: typeType;
    public isGeneric: boolean = false;
    public members: {"name": string, "type": string}[] = [];
    public args?: string[];
    public children?: string[];

    constructor(node: ts.Node, name: string, kind: typeKind, type?: typeType, members?: {"name": string, "type": string}[], args?: string[], children?: string[], isGeneric?: boolean){
        this.node = node;
        this.name = name;
        this.kind = kind;
        
        if(type != undefined){
            this.type = type;
        }
        if (members != undefined){
            this.members = members;
        }
        if (args != undefined){
            this.args = args;
        }
        if (children != undefined){
            this.children = children;
        }
        if (isGeneric != undefined) {
            this.isGeneric = isGeneric;
        }
    }
}