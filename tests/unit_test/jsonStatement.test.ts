import { parse } from "../../parser";
import * as ts from "typescript";

/**
 * Test the parse function
 */
describe("jsonStatement test", () => {
    const testFile = "tests/unit_test/test_files/complexType.ts"
    const json = parse(testFile)
    const obj = JSON.parse(json);
    let jsonStatements = obj.statements;

    it("Right number of statements", () => {
        expect(obj.statements).toHaveLength(8);
    });

    it("Right kind of statements", () => {
        expect(jsonStatements[0].kind).toBe(ts.SyntaxKind.InterfaceDeclaration);
        expect(jsonStatements[1].kind).toBe(ts.SyntaxKind.TypeAliasDeclaration);
        expect(jsonStatements[2].kind).toBe(ts.SyntaxKind.TypeAliasDeclaration);
        expect(jsonStatements[3].kind).toBe(ts.SyntaxKind.TypeAliasDeclaration);
        expect(jsonStatements[4].kind).toBe(ts.SyntaxKind.TypeAliasDeclaration);
        expect(jsonStatements[5].kind).toBe(ts.SyntaxKind.InterfaceDeclaration);
        expect(jsonStatements[6].kind).toBe(ts.SyntaxKind.InterfaceDeclaration);
        expect(jsonStatements[7].kind).toBe(ts.SyntaxKind.TypeAliasDeclaration);
    });

    for (let i = 0; i < jsonStatements.length; i++){
        console.log(jsonStatements[i].members);
    }

    it("Right number of members", () => {
        expect(jsonStatements[0].members).toHaveLength(2);
        expect(jsonStatements[5].members).toHaveLength(3);
        expect(jsonStatements[6].members).toHaveLength(1);
    });
});