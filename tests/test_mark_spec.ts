import * as VL from "/Users/srizvi/Documents/DIG/apigen/generate/generatedVLClasses";
import { Spec } from "./../SourceFiles/SourceVLType";

const spec = VL.spec(VL.mark("bar"), "example.csv", VL.encode(VL.x("meters", "quantitative"), VL.y("meters", "quantitative"), VL.color("meters", "quantitative")));
console.log(spec);
console.log(VL.toSpec(spec));


const json: Spec = { "mark": "bar", "data" : "example.csv","encode": { "x": { "field": "meters", "type": "quantitative" }, "y": { "field": "meters", "type": "quantitative" }, "color": { "field": "meters", "type": "quantitative" }}}