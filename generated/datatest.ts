// import {BaseObject, copy, get, init, isString, merge, set} from './__util__';
import {BaseObject, annotate, assign, copy, get, init, isArray, isIterable, isString, raw, set} from './__util__';

class Data extends BaseObject {

  constructor(...args: any) {
    super();
    init(this);
    // set(this, "data", merge(0, get(this, "data"), args));
    if (args[0] !== undefined) set(this, "data", isArray(args[0]) ? {values: raw(args[0])} : isIterable(args[0]) ? {values: raw(args[0])} : isString(args[0]) ? {url: args[0]} : args[0]);
  }

  align(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "align", value);
      return obj;
    } else {
      return get(this, "align");
    }
  }

  autosize(value: "pad" | "none" | "fit" | "fit-x" | "fit-y" | {type: "pad" | "none" | "fit" | "fit-x" | "fit-y", resize: boolean, contains: "content" | "padding"}) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "autosize", value);
      return obj;
    } else {
      return get(this, "autosize");
    }
  }

  background(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "background", value);
      return obj;
    } else {
      return get(this, "background");
    }
  }

  bounds(value: "full" | "flush") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "bounds", value);
      return obj;
    } else {
      return get(this, "bounds");
    }
  }
}

export function data(...args: any) {
  return new Data(...args);
}

export function toSpec(obj: any){
    return obj;
}

export function toJSON(obj: BaseObject){
    var jsonString = JSON.stringify(obj.toObject());
    // jsonString = jsonString.replace("_arg", "");
    return jsonString;
}