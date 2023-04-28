import * as VL from "/Users/srizvi/Documents/DIG/apigen/generate/generatedVLClasses";
import { Spec } from "./../SourceFiles/SourceVLType";

const spec = VL.spec(VL.mark("bar"), "example.csv", VL.encode(VL.x("meters", "quantitative"), VL.y("meters", "quantitative"), VL.color(undefined, undefined, "color")));
console.log(spec);
console.log(VL.toSpec(spec));
console.log(VL.toJSON(spec));


const json: Spec = {"mark":{"type":"bar"},"data":"example.csv","encode":{"x":{"field":"meters","type":"quantitative"},"y":{"field":"meters","type":"quantitative"},"color":{"value":"color"}}}