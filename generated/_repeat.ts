import {BaseObject, copy, get, init, set} from './__util__';

class _Repeat extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  any(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "any", value);
      return obj;
    } else {
      return get(this, "any");
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

  string(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "string", value);
      return obj;
    } else {
      return get(this, "string");
    }
  }

  Data(value: UrlData | InlineData | NamedData | SequenceGenerator | SphereGenerator | GraticuleGenerator) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Data", value);
      return obj;
    } else {
      return get(this, "Data");
    }
  }

  Transform[](value: Transform[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Transform[]", value);
      return obj;
    } else {
      return get(this, "Transform[]");
    }
  }

  any(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "any", value);
      return obj;
    } else {
      return get(this, "any");
    }
  }

  boolean | RowCol<boolean>(value: false | true | RowCol<boolean>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "boolean | RowCol<boolean>", value);
      return obj;
    } else {
      return get(this, "boolean | RowCol<boolean>");
    }
  }

  number | RowCol<number>(value: number | RowCol<number>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "number | RowCol<number>", value);
      return obj;
    } else {
      return get(this, "number | RowCol<number>");
    }
  }

  "full" | "flush"(value: "full" | "flush") {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, ""full" | "flush"", value);
      return obj;
    } else {
      return get(this, ""full" | "flush"");
    }
  }

  number(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "number", value);
      return obj;
    } else {
      return get(this, "number");
    }
  }

  Resolve(value: Resolve) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Resolve", value);
      return obj;
    } else {
      return get(this, "Resolve");
    }
  }

  any(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "any", value);
      return obj;
    } else {
      return get(this, "any");
    }
  }

  any(value: any) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "any", value);
      return obj;
    } else {
      return get(this, "any");
    }
  }

  AutosizeType | AutoSizeParams(value: "pad" | "none" | "fit" | "fit-x" | "fit-y" | AutoSizeParams) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "AutosizeType | AutoSizeParams", value);
      return obj;
    } else {
      return get(this, "AutosizeType | AutoSizeParams");
    }
  }

  TopLevelParameter[](value: TopLevelParameter[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "TopLevelParameter[]", value);
      return obj;
    } else {
      return get(this, "TopLevelParameter[]");
    }
  }

  Config<any>(value: Config<any>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Config<any>", value);
      return obj;
    } else {
      return get(this, "Config<any>");
    }
  }

  Datasets(value: Datasets) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Datasets", value);
      return obj;
    } else {
      return get(this, "Datasets");
    }
  }

  Dict<unknown>(value: Dict<unknown>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "Dict<unknown>", value);
      return obj;
    } else {
      return get(this, "Dict<unknown>");
    }
  }

}

export function _Repeat(...args) {
  return new _Repeat(...args);
}