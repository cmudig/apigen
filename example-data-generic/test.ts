import * as VL from "./data";
const spec = VL.data("example.csv").autosize("fit").background("red").bounds("full");
// console.log(spec);
// console.log(VL.toSpec(spec));
console.log(VL.toJSON(spec));