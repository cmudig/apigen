import {BaseObject, copy, get, init, set} from './__util__';

class UrlData extends BaseObject {

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

export function urlData(...args) {
  return new UrlData(...args);
}