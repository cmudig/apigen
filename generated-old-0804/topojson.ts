import {BaseObject, copy, get, init, set} from './__util__';

class Topojson extends BaseObject {

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

export function topojson(...args) {
  return new Topojson(...args);
}