
import { BaseObject, copy, get, init, set } from '/Users/lvlanlan/Desktop/github_clone/apigen-try/util';

// from here are generated code
class Spec extends BaseObject{
  constructor(private mark_arg: Mark, private data_arg: Data, private encode_arg: Encoding) {
    super();
  }
}

export function spec(mark: Mark, data: Data, encode: Encoding){
  return new Spec(mark, data, encode);
}

type PrimitiveMark = "bar" | "area" | "line";

class Mark extends BaseObject {
    constructor(private type_arg: PrimitiveMark | { type: PrimitiveMark }) {
        super();
    }
}

export function mark(type: PrimitiveMark | { type: PrimitiveMark }) {
    return new Mark(type);
}

class Data extends BaseObject {
    constructor(private value: string) {
        super();
    }
}

export function data(value: string) {
    return new Data(value);
}

class Encoding extends BaseObject {
    constructor(private x?: X, private y?: Y, private color?: Color) {
        super();
    }
}

export function encode(x?: X, y?: Y, color?: Color) {
    return new Encoding(x, y, color);
}

class X extends BaseObject {
    private field_arg: string;
    private type_arg: "quantitative" | "ordinal";

    constructor() {
        super();
        this.field_arg = "";
        this.type_arg = "quantitative";
    }

    field(value: string) {
        if (value !== undefined) {
            this.field_arg = value;
        }
        return this;
    }

    type(value: "quantitative" | "ordinal") {
        this.type_arg = value;
        return this;
    }
}

export function x () {
    return new X();
}


class Y extends BaseObject {
    constructor(private field_arg: string, private type_arg: "quantitative" | "ordinal") {
        super();
    }

    field(value: string) {
        if (value !== undefined) {
            this.field_arg = value;
        }
    }

    type(value: "quantitative" | "ordinal") {
        this.type_arg = value;
    }
}

export function y (field: string, type: "quantitative" | "ordinal") {
    return new Y(field, type);
}

class Color extends BaseObject {
    constructor(private field_arg?: { field: string, type: "quantitative" | "ordinal" }, private value_arg?: string) {
        super();
    }

    field(field: string, type: "quantitative" | "ordinal") {
        this.field_arg = { field, type };
    }

    value(value: string) {
        this.value_arg = value;
    }
}

export function color(fieldObject?: { field: string, type: "quantitative" | "ordinal" }, value?: string) {
    return new Color(fieldObject, value);
}

export function toSpec(obj: any){
    return obj;
}

export function toJSON(obj: BaseObject){
    var jsonString = JSON.stringify(obj);
    jsonString = jsonString.replace("_arg", "");
    return JSON.stringify(obj);
}

// const VLspec = spec(mark("line"), data("example.csv"), encode(x("meters", "quantitative")));
const VLspec = spec(mark("line"), data("example.csv"), encode(x().field("meters").type("quantitative")));
// const VLspec = mark("bar").data("example.csv").encode(x("meters", "quantitative"), y("meters", "quantitative"), color().value("color"));
console.log(toSpec(VLspec));
console.log(toJSON(VLspec));