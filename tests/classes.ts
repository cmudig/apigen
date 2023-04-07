import {} from './utils'

class Mark {
    constructor(private type: "bar" | "area" | "line") {}
    
  }
  
export function mark(type: "bar" | "area" | "line"){
    return new Mark(type);
  }

class X {
    constructor(private field: string, private type: "quantitative" | "ordinal") {}
    
  }
  
export function x(field: string, type: "quantitative" | "ordinal"){
    return new X(field, type);
  }

class Y {
    constructor(private field: string, private type: "quantitative" | "ordinal") {}
    
  }
  
export function y(field: string, type: "quantitative" | "ordinal"){
    return new Y(field, type);
  }

class Color {
    constructor(private field: string, private type: "quantitative" | "ordinal") {}
    
  }
  
export function color(field: string, type: "quantitative" | "ordinal"){
    return new Color(field, type);
  }

class Encoding {
    constructor(private x?: X, private y?: Y, private color?: Color) {}
    
  }
  
export function encoding(x?: X, y?: Y, color?: Color){
    return new Encoding(x, y, color);
  }

class Spec {
    constructor(private mark: Mark, private encoding: Encoding) {}
    
  }
  
export function spec(mark: Mark, encoding: Encoding){
    return new Spec(mark, encoding);
  }

export function toSpec(obj: any){
      return JSON.stringify(obj);
    }