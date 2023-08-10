import {BaseObject, copy, get, init, set} from './__util__';
import {DataFormat, InlineDataset} from 'vega-lite/src/data';

class InlineData extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  values(value: InlineDataset) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "values", value);
      return obj;
    } else {
      return get(this, "values");
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

  name(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "name", value);
      return obj;
    } else {
      return get(this, "name");
    }
  }

}

export function inlineData(...args) {
  return new InlineData(...args);
}