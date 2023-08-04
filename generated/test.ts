/**
 * Previous Version to test Generated Code
 */
import * as VL from "./datatest";
const spec = VL.data("example.csv");
// const spec = VL.spec(VL.mark("bar"), "example.csv", VL.encode(VL.x("meters", "quantitative"), VL.y("meters", "quantitative"), VL.color(undefined, undefined, "color")));
console.log(spec);
console.log(VL.toSpec(spec));
console.log(VL.toJSON(spec));

// /**
//  * Current Verison to test Generated Code
//  */
// import * as vl from "/Users/lvlanlan/Desktop/github_clone/apigen-try/output";
// // const spec = vl.spec(vl.mark("bar"), vl.data("example.csv"), vl.encode(vl.x("meters", "quantitative"), vl.y("meters", "quantitative"), vl.color().value("color")));
// const spec = vl.mark("bar").data("example.csv").encode(vl.x("meters", "quantitative"), vl.y("meters", "quantitative"), vl.color().value("color"));
// console.log(spec);
// console.log(vl.toSpec(spec));
// console.log(vl.toJSON(spec));