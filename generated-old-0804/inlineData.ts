import {BaseObject, copy, get, init, set} from './__util__';

class InlineData extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  InlineDataset(value: string | object | number[] | string[] | boolean[] | object[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "InlineDataset", value);
      return obj;
    } else {
      return get(this, "InlineDataset");
    }
  }

  DataFormat(value: CsvDataFormat | DsvDataFormat | JsonDataFormat | TopoDataFormat) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "DataFormat", value);
      return obj;
    } else {
      return get(this, "DataFormat");
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

}

export function inlineData(...args) {
  return new InlineData(...args);
}