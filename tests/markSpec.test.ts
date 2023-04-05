import * as VL from "../generatedVLClasses";

describe('markSpec', () => {

    const spec = VL.spec(VL.mark("bar"));

    it('test toSpec()', () => {
        expect(VL.toSpec(spec)).toEqual("\{\"mark\":{\"type\":\"bar\"}}");
    });

    it('test toSpec() MatchSnapShot', () => {
        expect(VL.toSpec(spec)).toMatchSnapshot();
    });

});