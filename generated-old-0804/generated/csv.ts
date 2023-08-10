import {BaseObject, copy, get, init, set} from './__util__';
import {Parse} from 'vega-lite/src/data';

class Csv extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  type(value: "csv" | "tsv") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "type", value);
      return obj;
    } else {
      return get(this, "type");
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

export function csv(...args) {
  return new Csv(...args);
}