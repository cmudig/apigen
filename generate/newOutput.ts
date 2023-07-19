import { BaseObject, assign, copy, get, init, merge, set, isString } from '/Users/lvlanlan/Desktop/github_clone/apigen/generate/__util__';

class Spec extends BaseObject{
  constructor(private mark_arg: Mark, private data_arg: Data, private encode_arg: Encoding) {
    super();
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
    constructor(private type_arg: "bar" | "area" | "line" | { type_arg: "bar" | "area" | "line" }) {
        super();
        init(this);
    }

    type(value: "bar" | "area" | "line" | { value: "bar" | "area" | "line" }) {
        // TODO: not finsihed yet
        return get(this, "type");
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
}

export function mark(type: "bar" | "area" | "line" | { type_arg: "bar" | "area" | "line" }) {
    return new Mark(type);
}

class Data extends BaseObject {
    constructor(private _arg: string) {
        super();
        init(this);
        if(_arg !== undefined) set(this, "data", _arg);
    }
}

export function data(_arg: string) {
    return new Data(_arg);
}

interface FieldDef {
    field: string
    type: "quantitative" | "ordinal"
}

type PositionDef = { filed:string, type: "quantitative" | "ordinal" };

type ColorDef = FieldDef | { value: string }

class Encoding extends BaseObject {
    constructor(private x_arg?: PositionDef, private y_arg?: PositionDef, private color_arg?: ColorDef) {
        super();
        init(this);
        if(x_arg !== undefined) set(this, "x", x_arg);
        if(y_arg !== undefined) set(this, "y", y_arg);
        if(color_arg !== undefined) set(this, "color", color_arg);
    }

    x(value: PositionDef) {
        if (arguments.length) {
            const obj = copy(this);
            set(obj, "x", value);
            return obj;
        } else {
            return get(this, "x");
        }
    }

    y(value: PositionDef) {
        if (arguments.length) {
            const obj = copy(this);
            set(obj, "y", value);
            return obj;
        } else {
            return get(this, "y");
        }
    }

    color(value: ColorDef) {
        if (arguments.length) {
            const obj = copy(this);
            set(obj, "color", value);
            return obj;
        } else {
            return get(this, "color");
        }
    }
}

class X extends BaseObject {
    constructor(private field_arg: string, private type_arg: "quantitative" | "ordinal") {
        super();
        init(this);
        if(field_arg !== undefined) set(this, "field", field_arg);
        if(type_arg !== undefined) set(this, "type", type_arg);
    }

    // y (field: string, type: "quantitative" | "ordinal") {
    //     if (field !== undefined) {
    //         const obj = copy(this);
    //         set(obj, "y", {field, type});
    //         return obj;
    //     } else {
    //         return get(this, "y");
    //     }
    // }
}

export function x (field: string, type: "quantitative" | "ordinal") {
    return new X(field, type);
}

class Y extends BaseObject {
    constructor(private field_arg: string, private type_arg: "quantitative" | "ordinal") {
        super();
        init(this);
        if(field_arg !== undefined) set(this, "field", field_arg);
        if(type_arg !== undefined) set(this, "type", type_arg);
    }

    // x (field: string, type: "quantitative" | "ordinal") {
    //     if (field !== undefined) {
    //         const obj = copy(this);
    //         set(obj, "x", {field, type});
    //         return obj;
    //     } else {
    //         return get(this, "x");
    //     }
    // }
}

export function y (field: string, type: "quantitative" | "ordinal") {
    return new Y(field, type);
}

class Color extends BaseObject {
    constructor() {
        super();
        init(this);
    }

    field(field: string, type: "quantitative" | "ordinal") {
        if (field !== undefined) {
            const obj = copy(this);
            set(obj, "color", {field, type});
            return obj;
        } else {
            return get(this, "field");
        }
    }

    value(value: string) {
        if (value !== undefined) {
            const obj = copy(this);
            set(obj, "color", value);
            return obj;
        } else {
            return get(this, "value");
        }
    }
}

export function color() {
    return new Color();
}

export function toSpec(obj: any){
  return obj;
}

export function toJSON(obj: any){
  return JSON.stringify(obj);
}