import {BaseObject, copy, get, init, set} from './__util__';
import {Parse} from 'vega-lite/src/data';

class Topojson extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  type(value: "topojson") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "type", value);
      return obj;
    } else {
      return get(this, "type");
    }
  }

  feature(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "feature", value);
      return obj;
    } else {
      return get(this, "feature");
    }
  }

  mesh(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "mesh", value);
      return obj;
    } else {
      return get(this, "mesh");
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

export function topojson(...args) {
  return new Topojson(...args);
}