import {BaseObject, copy, get, init, set} from './__util__';

class Csv extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  "csv" | "tsv"(value: "csv" | "tsv") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, ""csv" | "tsv"", value);
      return obj;
    } else {
      return get(this, ""csv" | "tsv"");
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

export function csv(...args) {
  return new Csv(...args);
}