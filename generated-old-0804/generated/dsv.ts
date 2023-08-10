import {BaseObject, copy, get, init, set} from './__util__';
import {Parse} from 'vega-lite/src/data';

class Dsv extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  type(value: "dsv") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "type", value);
      return obj;
    } else {
      return get(this, "type");
    }
  }

  delimiter(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "delimiter", value);
      return obj;
    } else {
      return get(this, "delimiter");
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

export function dsv(...args) {
  return new Dsv(...args);
}