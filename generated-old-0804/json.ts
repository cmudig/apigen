import {BaseObject, copy, get, init, set} from './__util__';

class Json extends BaseObject {

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

export function json(...args) {
  return new Json(...args);
}