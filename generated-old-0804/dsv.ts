import {BaseObject, copy, get, init, set} from './__util__';

class Dsv extends BaseObject {

  constructor(...args) {
    super();
    init(this);
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

  Parse(value: Parse) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Parse", value);
      return obj;
    } else {
      return get(this, "Parse");
    }
  }

}

export function dsv(...args) {
  return new Dsv(...args);
}