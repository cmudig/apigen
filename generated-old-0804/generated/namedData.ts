import {BaseObject, copy, get, init, set} from './__util__';
import {DataFormat} from 'vega-lite/src/data';

class NamedData extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  name(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "name", value);
      return obj;
    } else {
      return get(this, "name");
    }
  }

  format(value: DataFormat) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "format", value);
      return obj;
    } else {
      return get(this, "format");
    }
  }

}

export function namedData(...args) {
  return new NamedData(...args);
}