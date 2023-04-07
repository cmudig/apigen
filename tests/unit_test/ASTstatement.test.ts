import { parse, generateStatements } from '../../parser';
import { ASTStatement } from '../../internalRepresentation';

/**
 * Test the generateStatements function
 */
describe('generateStatements', () => {
  it('should generate an array of ASTStatements from a JSON array', () => {
    const jsonStatements = [
      {
        pos: 0,
        end: 73,
        kind: 261,
        name: { pos: 9, end: 18, kind: 79, escapedText: 'FieldDef', id: 3 },
        members: [
          { pos: 20,
            end: 36,
            kind: 168,
            name: { pos: 20, end: 28, kind: 79, escapedText: 'field', id: 5 },
            type: { pos: 29, end: 36, kind: 152, id: 6 },
            id: 4
          },
          { pos: 36,
            end: 71,
            kind: 168,
            name: { pos: 36, end: 43, kind: 79, escapedText: 'type', id: 8 },
            type: { pos: 44, end: 71, kind: 189, 
              types: [
                { pos: 44, end: 59, kind: 198, literal:
                  { pos: 44,
                    end: 59,
                    kind: 10,
                    text: 'quantitative',
                    hasExtendedUnicodeEscape: false,
                    id: 11
                  }, 
                  id: 10
                },
                { pos: 61, end: 71, kind: 198, literal: 
                  { pos: 61,
                    end: 71,
                    kind: 10,
                    text: 'ordinal',
                    hasExtendedUnicodeEscape: false,
                    id: 13
                  }, 
                  id: 12
                }
              ], id: 9
            },
            id: 7
          }
        ],
        id: 2
      }
    ];

    const expectedASTStatements: ASTStatement[] = [
      new ASTStatement("FieldDef", 261, undefined, { "field": "79", "type": "79" }, { type: [ "quantitative", "ordinal" ] }, undefined)
    ];

    const Statement = generateStatements(jsonStatements)

    expect(Statement).toEqual(expectedASTStatements);
  });
});
