import { StatementedNode, ts, TypeElementMemberStructures } from "ts-morph";

export type typePrimitive = string | number;
export type typeComplex = ts.SyntaxKind.UnionType | ts.SyntaxKind.LiteralType;
export type typeKind = ts.SyntaxKind.InterfaceDeclaration | ts.SyntaxKind.TypeAliasDeclaration;
export type typeType = typePrimitive | typeComplex ;

export class ASTStatement {
    public name: string | undefined;
    public kind: typeKind | undefined;
    public type: typeType | undefined;

    constructor(name: string, kind: typeKind, type: typeType){
        this.name = name;
        this.kind = kind;
        this.type = type;
    }
}