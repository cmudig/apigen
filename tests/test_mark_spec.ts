import * as VL from "../generatedVLClasses";


const spec = VL.spec(VL.mark("bar"));
console.log(spec);
console.log(VL.toSpec(spec));

