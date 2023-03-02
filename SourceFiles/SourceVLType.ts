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
    mark: Mark,
    data: string,
    encode: Encoding
}

  //test
//   vl.mark('bar')
//   .data("hello.csv")
//   .encode(
//     vl.x().field("foo").type("quantitative"),
//     vl.y().field("bar").type("ordial"),
//     vl.color().value("yellow")
//   )

//   vl.toObject()