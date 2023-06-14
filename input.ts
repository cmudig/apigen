interface FieldDef {
  field: string
  type: "quantitative" | "ordinal"
}

type ValueDef<T> = {
  value: T
}

type PositionDef = FieldDef;
type ColorDef = FieldDef | ValueDef<string>
type PrimitiveMark = "bar" | "area" | "line";
type Mark = PrimitiveMark | {
  type: PrimitiveMark
}

interface Encoding {
  x?: PositionDef;
  y?: PositionDef;
  color?: ColorDef;
}

interface LayerSpec {
  layer: Spec[]
}

export type Spec = {
    mark: Mark
    data: string
    encode: Encoding
}
// recursive type commented out for now
// | LayerSpec;