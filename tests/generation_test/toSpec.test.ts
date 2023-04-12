import * as VL from "./generatedVLClasses";
import * as fs from 'fs';

/**
 * Test the generated file is working.
 */
describe('markSpec', () => {

    const spec = VL.spec(VL.mark("bar"), VL.encode());

    it('test toSpec()', () => {
        console.log(VL.toSpec(spec));
        const expected = fs.readFileSync("tests/generation_test/toSpec_expected_output.txt", "utf8");
        expect(VL.toSpec(spec)).toEqual(expected);
    });

    // it('test toSpec() MatchSnapShot', () => {
    //     expect(VL.toSpec(spec)).toMatchSnapshot();
    // });

});