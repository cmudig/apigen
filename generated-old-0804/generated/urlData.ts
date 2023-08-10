import {BaseObject, copy, get, init, set} from './__util__';
import {DataFormat} from 'vega-lite/src/data';

class UrlData extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  url(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "url", value);
      return obj;
    } else {
      return get(this, "url");
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

export function urlData(...args) {
  return new UrlData(...args);
}