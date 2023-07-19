class Field {
    constructor(private field: string, private type: "quantitative" | "ordinal") {}

}

class Value<T> {
    constructor(private value: T) {}

}

class Position {
    constructor(private type: Field) {}
    
}

// QUESTION: if the argument is a object, how to pass the argument as string?
class Color {
    constructor(private type: Field | Value<string>) {}
    
}

export function color(arg: Field | Value<string>){
    return new Color(arg);
}

class PrimitiveMark {
    constructor(private type: "bar" | "area" | "line") {}

}

class Mark {
    constructor(private type: PrimitiveMark | { PrimitiveMark }) {}

}
  
export function mark(type: PrimitiveMark | { PrimitiveMark }) {
    return new Mark(type);

}

class X {
    // constructor(private field?: string, private type?: "quantitative" | "ordinal") {}
    constructor(private arg: Position) {}
    
}

export function x(arg){
    return new X(arg);
}  

class Y {
    constructor(private arg: Position) {}
    
}

export function y(arg){
    return new Y(arg);
}

// export function x(field?: string, type?: "quantitative" | "ordinal"){
//     return new X(field, type);
// }

// class Y {
//     constructor(private field?: string, private type?: "quantitative" | "ordinal") {}
    
// }
  
// export function y(field?: string, type?: "quantitative" | "ordinal"){
//     return new Y(field, type);
// }

class Encoding {
    constructor(private x?: Position, private y?: Position, private color?: Color) {}
    
}
  
export function encode(x?: Position, y?: Position, color?: Color){
    return new Encoding(x, y, color);
}

class Spec {
    constructor(private mark: Mark, private data: string, private encode: Encoding) {}
    
}
  
export function spec(mark: Mark, data: string, encode: Encoding){
    return new Spec(mark, data, encode);
}

export function toSpec(obj: any){
      return obj;
}

export function toJSON(obj: any){
      return JSON.stringify(obj);
}