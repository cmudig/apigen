import { BaseObject, copy, get, init, set, merge, raw, assign, isArray, isIterable, isString } from '/Users/lvlanlan/Desktop/github_clone/apigen-try/util';

class Spec extends BaseObject{

    constructor() {
        super();
        init(this);
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

export function spec(){
    return new Spec();
}

class Mark extends BaseObject {
    constructor(private type: PrimitiveMark | { type: PrimitiveMark }) {
        super();
        init(this);
        var setType = type;
        if (typeof type === "string") {
            setType = { "type": type };
        } else if (typeof type === "object") {
            set(this, "type", type.type);
        } else {
            throw new Error("Invalid type for mark");
        }
        set(this, "mark", merge(0, get(this, "mark"), setType));
    }

    data(value: string) {
        if (value !== undefined) {
            const obj = copy(this);
            var setValue = isArray(value) ? {values: raw(value)} : isIterable(value) ? {values: raw(value)} : isString(value) ? {url: value} : value;
            set(obj, "data", setValue);
            return obj;
        } else {
            return get(this, "data");
        }
    }

    encode(x?: X, y?: Y, color?: Color) {
        var vals: any[] = [];
        if (x != undefined) { vals.push(x); }
        if (y != undefined) { vals.push(y); }
        if (color != undefined) { vals.push(color); }

        const obj = copy(this);
        const valEncoding = get(this, "encoding");
        if (valEncoding) vals = [valEncoding].concat(vals);

        set(obj, "encoding", merge(1, vals));
        return obj;
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
    constructor(private _x?: X, private _y?: Y, private _color?: Color) {
        super();
        init(this);
        if(x !== undefined) set(this, "x", x);
        if(y !== undefined) set(this, "y", y);
        if(color !== undefined) set(this, "color", color);
    }
}

export function encoding(x?: X, y?: Y, color?: Color) {
    return new Encoding(x, y, color);
}

class X extends BaseObject {
    constructor() {
        super();
        init(this);
    }

    field(value: string) {
        if (value.length) {
            const obj = copy(this);
            set(obj, "field", value);
            return obj;
        } else {
            return get(this, "field");
        }
    }

    type(value: "quantitative" | "ordinal") {
        if (value.length) {
            const obj = copy(this);
            set(obj, "type", value);
            return obj;
        } else {
            return get(this, "type");
        }
    }

    toObject(flag: number = 0) {
        return flag ? {x: super.toObject()} : super.toObject();
    }
}

export function x () {
    return new X();
}

class Y extends BaseObject {
    constructor() {
        super();
        init(this);
    }

    field(value: string) {
        if (value.length) {
            const obj = copy(this);
            set(obj, "field", value);
            return obj;
        } else {
            return get(this, "field");
        }
    }

    type(value: "quantitative" | "ordinal") {
        if (value.length) {
            const obj = copy(this);
            set(obj, "type", value);
            return obj;
        } else {
            return get(this, "type");
        }
    }

    toObject(flag: number = 0) {
        return flag ? {y: super.toObject()} : super.toObject();
    }
}

export function y () {
    return new Y();
}

class Color extends BaseObject {
    constructor() {
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

    toObject(flag: number = 0) {
        return flag ? {color: super.toObject()} : super.toObject();
    }
}

export function color() {
    return new Color();
}

function createSpec(self: BaseObject) {
    if (self !== undefined) {
        return self.toObject();
    }
}

export function toSpec(obj: any){
    return createSpec(obj);
}

export function toJSON(obj: BaseObject){
    return JSON.stringify(createSpec(obj));
}

// const VLspec = spec(mark("line"), data("example.csv"), encode(x("meters", "quantitative"), y("year", "quantitative"), color().value("green")));
// const VLspec = mark("bar").data("example.csv").encode(x("meters", "quantitative"), y("meters", "quantitative"), color().value("color"));
const VLspec = mark("bar").data("example.csv").encode(x().field("meters").type("quantitative"), y().field("year").type("quantitative"), color().value("green"));
// const VLspec = x().field("meters").type("quantitative");
// const VLspec = mark("bar").data("example.csv");
console.log(toSpec(VLspec));
// console.log(toJSON(VLspec));