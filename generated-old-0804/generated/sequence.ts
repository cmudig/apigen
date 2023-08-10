import {BaseObject, copy, get, init, set} from './__util__';

class Sequence extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  number(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "number", value);
      return obj;
    } else {
      return get(this, "number");
    }
  }

  number(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "number", value);
      return obj;
    } else {
      return get(this, "number");
    }
  }

  number(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "number", value);
      return obj;
    } else {
      return get(this, "number");
    }
  }

  string(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "string", value);
      return obj;
    } else {
      return get(this, "string");
    }
  }

}

export function sequence(...args) {
  return new Sequence(...args);
}