import * as VL from "/Users/srizvi/Documents/DIG/apigen/generate/generatedVLClasses";

const spec = VL.spec(VL.mark("bar"), VL.encode(VL.x("meters", "quantitative"), VL.y("meters", "quantitative"), VL.color("meters", "quantitative")));
console.log(spec);
console.log(VL.toSpec(spec));

