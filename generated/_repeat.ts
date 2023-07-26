import {BaseObject, copy, get, init, isString, merge, set} from './__util__';

class _repeat extends BaseObject {

  constructor(...args) {
    super();
    init(this);
    set(this, _repeat, merge(0, get(this, "_repeat"), args));
  }

  align(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "align", value);
      return obj;
    } else {
      return get(this, "align");
    }
  }

  autosize(value: AutosizeType | AutoSizeParams) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "autosize", value);
      return obj;
    } else {
      return get(this, "autosize");
    }
  }

  background(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "background", value);
      return obj;
    } else {
      return get(this, "background");
    }
  }

  bounds(value: "full" | "flush") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "bounds", value);
      return obj;
    } else {
      return get(this, "bounds");
    }
  }

  center(value: boolean | RowCol<boolean>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "center", value);
      return obj;
    } else {
      return get(this, "center");
    }
  }

  columns(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "columns", value);
      return obj;
    } else {
      return get(this, "columns");
    }
  }

  config(value: Config<any>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "config", value);
      return obj;
    } else {
      return get(this, "config");
    }
  }

  data(value: Data) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "data", value);
      return obj;
    } else {
      return get(this, "data");
    }
  }

  datasets(value: Datasets) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "datasets", value);
      return obj;
    } else {
      return get(this, "datasets");
    }
  }

  description(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "description", value);
      return obj;
    } else {
      return get(this, "description");
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

  padding(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "padding", value);
      return obj;
    } else {
      return get(this, "padding");
    }
  }

  params(value: TopLevelParameter[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "params", value);
      return obj;
    } else {
      return get(this, "params");
    }
  }

  repeat(value: string[] | RepeatMapping | LayerRepeatMapping) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "repeat", value);
      return obj;
    } else {
      return get(this, "repeat");
    }
  }

  resolve(value: Resolve) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "resolve", value);
      return obj;
    } else {
      return get(this, "resolve");
    }
  }

  spacing(value: number | RowCol<number>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "spacing", value);
      return obj;
    } else {
      return get(this, "spacing");
    }
  }

  spec(value: UnitSpecWithFrame<Field> | LayerSpec<Field> | NonNormalizedSpec) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "spec", value);
      return obj;
    } else {
      return get(this, "spec");
    }
  }

  title(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "title", value);
      return obj;
    } else {
      return get(this, "title");
    }
  }

  transform(value: Transform[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "transform", value);
      return obj;
    } else {
      return get(this, "transform");
    }
  }

  usermeta(value: Dict<unknown>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "usermeta", value);
      return obj;
    } else {
      return get(this, "usermeta");
    }
  }

}

export function _repeat(...args) {
  return new _repeat(...args);
}