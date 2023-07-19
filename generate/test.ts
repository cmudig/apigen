import * as vl from "./newOutput";

const spec = vl.mark("bar").data("example.csv").encode(vl.x("meters", "quantitative"), vl.y("meters", "quantitative"), vl.color().value("color"));
console.log(spec);
console.log(vl.toSpec(spec));
console.log(vl.toJSON(spec));