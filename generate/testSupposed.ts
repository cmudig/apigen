import * as VL from "../generate/supposedGeneratedVLClasses";
import { Spec } from "./../SourceFiles/SourceVLType";

const spec = VL.spec(VL.mark("bar"), "data/movies.json", VL.encode(VL.x("meters", "quantitative"), VL.y("meters", "quantitative"), VL.color("color")));
console.log(spec);
// console.log(VL.toSpec(spec));
console.log(VL.toJSON(spec));

VL.color().field("foo");//this is what we are going to support
VL.color({field: "foo"});


// VL.mark("bar").data("data/movies.json").encode();