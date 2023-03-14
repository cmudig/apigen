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

