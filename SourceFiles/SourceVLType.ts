interface FieldDef {
  field: string
  type: "quantitative" | "ordinal"
}

type ValueDef<T> = {
  value: T
}

type PositionDef = FieldDef;
type ColorDef = FieldDef | ValueDef<string>
type Mark = "bar" | "area" | "line"

interface Encoding {
  x?: PositionDef;
  y?: PositionDef;
  color?: ColorDef;
}

export type Spec = {
    mark: Mark
    data: string
    encode: Encoding
}

//test
//populate internal representation of the object
//   vl.mark('bar')
//   .data("hello.csv")
//   .encode(
//     vl.x().field("foo").type("quantitative"),
//     vl.y().field("bar").type("ordial"),
//     vl.color().value("yellow")
//   )
 // this will return the final object
//   vl.toObject()



// function toObject(value) {
//   if (isArray(value)) {
//     return value.map(d => recurse(d));
//   } else if (isObject(value)) {
//     const data = value[Data] || value;
//     return isArray(data)
//       ? recurse(data)
//       : Object.keys(data).reduce((_, k) => {
//           _[k] = recurse(data[k]);
//           return _;
//         }, {});
//   } else {
//     return value;
//   }
// }

// class Spec {//class vl

//   function mark(value){
  
//   if (value == "bar" ||  "area" || "line") {
//     this.mark = "bar";
//   }
    
//   function encode
//   function data
//   X
//   Y
//   color

// }

//