import {BaseObject, assign, copy, get, init, merge, set, isString} from './__util__';

class Position extends BaseObject {
  
  constructor(...args) {
    super();
    init(this);
    assign(this, ...args);
  }

  field(field: string, type: "quantitative" | "ordinal") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "field", field);
      set(obj, "type", type);
      return obj;
    } else {
      return get(this, "field");
    }
  }

}

export function position(){
  return new Position();
}


class X extends BaseObject {

  constructor(...args) {
    super();
    init(this);
    assign(this, ...args);
  }

  position() {
    return get(this, "position");
  }
}

export function x(...args) {
  return new X(...args);
}

class Y extends BaseObject {

  constructor(...args) {
    super();
    init(this);
    assign(this, ...args);
  }

  position() {
    return get(this, "position");
  }
}

export function y(...args) {
  return new Y(...args);
}

class Mark extends BaseObject {
  // constructor(private type: "bar" | "area" | "line" | { type: "bar" | "area" | "line"}) {}

  constructor(...args) {
    super();
    init(this);
    args = args.map(_ => isString(_) ? {type: _} : _);
    set(this, "mark", merge(0, get(this, "mark"), args));
  }

  
}

export function mark(type: "bar" | "area" | "line" | { type: "bar" | "area" | "line"}){
  if (type === undefined) {
    return new Mark();
  } else {
    switch (type) {
      case "bar": return new Mark({type: "bar"});
      case "area": return new Mark({type: "area"});
      case "line": return new Mark({type: "line"});
    }
  }
}

class Color extends BaseObject{
  // constructor(private field?: string, private type?: "quantitative" | "ordinal", private value?: string) {}
  constructor(...args) {
    super();
    init(this);
    assign(this, ...args);
  }

  field(field: {field:string, type:"quantitative" | "ordinal"} | string ){
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "color", field);
      return obj;
    } else {
      return get(this, "color");
    }
  }

  // field(field:string, type:"quantitative" | "ordinal"){
  //   if (arguments.length) {
  //     const obj = copy(this);
  //     set(obj, "field", field);
  //     set(obj, "type", type);
  //     return obj;
  //   } else {
  //     return get(this, "field");
  //   }
  // }

  // value(value:string){
  //   if (arguments.length) {
  //     const obj = copy(this);
  //     set(obj, "value", value);
  //     return obj;
  //   } else {
  //     return get(this, "value");
  //   }
  // }
}

export function color() {
  return new Color();
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