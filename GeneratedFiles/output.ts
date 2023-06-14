import { BaseObject, copy, get, init, set } from '/Users/lvlanlan/Desktop/github_clone/apigen-try/util';

// from here are generated code
class Spec extends BaseObject{
  constructor(private mark_arg: Mark, private data_arg: Data, private encode_arg: Encoding) {
    super();
    init(this);
    set(this, "mark", mark_arg);
    set(this, "data", data_arg);
    set(this, "encoding", encode_arg);
  }
  
  mark(value: Mark) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "mark", value);
      return obj;
    } else {
      return get(this, "mark");
    }
  }

  data(value: string) {
    if (arguments.length) {
        const obj = copy(this);
        set(obj, "data", value);
        return obj;
    } else {
        return get(this, "data");
    }
  }

  encode(value: Encoding) {
    if (arguments.length) {
        const obj = copy(this);
        set(obj, "encoding", value);
        return obj;
    } else {
        return get(this, "encoding");
    }
  }
}

export function spec(mark: Mark, data: Data, encode: Encoding){
  return new Spec(mark, data, encode);
}

class Mark extends BaseObject {
    constructor(private type: PrimitiveMark | { type: PrimitiveMark }) {
        super();
        init(this);
        if (typeof type === "string") {
            set(this, "type", type);
        } else if (typeof type === "object") {
            set(this, "type", type.type);
        } else {
            throw new Error("Invalid type for mark");
        }
    }

    data(value:string) {
        if (value !== undefined) {
            const obj = copy(this);
            set(obj, "data", value);
            return obj;
        } else {
            return get(this, "data");
        }
    }

    encode(value: Encoding) {
        if (value !== undefined) {
            const obj = copy(this);
            set(obj, "encoding", value);
            return obj;
        } else {
            return get(this, "encoding");
        }
    }
}

type PrimitiveMark = "bar" | "area" | "line";

export function mark(type: PrimitiveMark | { type: PrimitiveMark }) {
    return new Mark(type);
}

class Data extends BaseObject {
    constructor(private value: string) {
        super();
        init(this);
        if(value !== undefined) set(this, "data", value);
    }
}

export function data(value: string) {
    return new Data(value);
}

class Encoding extends BaseObject {
    constructor(private x?: X, private y?: Y, private color?: Color) {
        super();
        init(this);
        if(x !== undefined) set(this, "x", x);
        if(y !== undefined) set(this, "y", y);
        if(color !== undefined) set(this, "color", color);
    }
}

export function encode(x?: X, y?: Y, color?: Color) {
    return new Encoding(x, y, color);
}

class X extends BaseObject {
    constructor(private field: string, private type: "quantitative" | "ordinal") {
        super();
        init(this);
        if(field !== undefined) set(this, "field", field);
        if(type !== undefined) set(this, "type", type);
    }
}

export function x (field: string, type: "quantitative" | "ordinal") {
    return new X(field, type);
}

class Y extends BaseObject {
    constructor(private field: string, private type: "quantitative" | "ordinal") {
        super();
        init(this);
        if(field !== undefined) set(this, "field", field);
        if(type !== undefined) set(this, "type", type);
    }
}

export function y (field: string, type: "quantitative" | "ordinal") {
    return new Y(field, type);
}

class Color extends BaseObject {
    constructor(private field_arg?: { field: string, type: "quantitative" | "ordinal" }, private value_arg?: string) {
        super();
        init(this);
    }

    field(field: string, type: "quantitative" | "ordinal") {
        if (field !== undefined) {
            const obj = copy(this);
            set(obj, "field", {field, type});
            return obj;
        } else {
            return get(this, "field");
        }
    }

    value(value: string) {
        if (value !== undefined) {
            const obj = copy(this);
            set(obj, "value", value);
            obj.value_arg = value;
            return obj;
        } else {
            return get(this, "value");
        }
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

const VLspec = spec(mark("line"), data("example.csv"), encode(x("meters", "quantitative")));
// const VLspec = mark("bar").data("example.csv").encode(x("meters", "quantitative"), y("meters", "quantitative"), color().value("color"));
console.log(toSpec(VLspec));
console.log(toJSON(VLspec));