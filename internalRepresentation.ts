import { StatementedNode, ts, TypeElementMemberStructures } from "ts-morph";

export type typePrimitive = string | number;
export type typeComplex = ts.SyntaxKind.UnionType | ts.SyntaxKind.LiteralType;
export type typeKind = ts.SyntaxKind.InterfaceDeclaration | ts.SyntaxKind.TypeAliasDeclaration;
export type typeType = typePrimitive | typeComplex ;

export class ASTStatement { //TODO: rename
    public name: string | undefined;
    public kind: typeKind | undefined; 
    public type: typeType | undefined;
    public isGeneric: boolean = false;
    public members: Record<string, string> = {};
    public memberUnionTypes: Record<string, string[]> = {};
    public args: string[] | undefined;
    public children: string[] | undefined;

    constructor(name: string, kind: typeKind|undefined, type?: typeType | undefined, members?: Record<string, string> | undefined, memberUnionTypes?: Record<string, string[]> | undefined, args?:string[] | undefined, children?: string[] | undefined, isGeneric?: boolean){
        this.name = name;
        this.kind = kind;
        
        if(type != undefined){
            this.type = type;
        }
        if (members != undefined){
            this.members = members;
        }
        if (memberUnionTypes != undefined){
            this.memberUnionTypes = memberUnionTypes;
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