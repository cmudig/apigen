import {BaseObject, copy, get, init, set} from './__util__';
import {Parse} from 'vega-lite/src/data';

class Json extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  type(value: "json") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "type", value);
      return obj;
    } else {
      return get(this, "type");
    }
  }

  property(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "property", value);
      return obj;
    } else {
      return get(this, "property");
    }
  }

  parse(value: Parse) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "parse", value);
      return obj;
    } else {
      return get(this, "parse");
    }
  }

}

export function json(...args) {
  return new Json(...args);
}