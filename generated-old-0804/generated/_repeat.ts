import {BaseObject, copy, get, init, set} from './__util__';
import {TopLevelParameter, Transform, string} from '/Users/lvlanlan/Desktop/github_clone/apigen-try/node_modules/typescript/lib/lib.es5.d.ts';
import {TitleParams} from 'vega-lite/src/title';
import {Data} from 'vega-lite/src/data';
import {LayoutAlign} from 'vega-typings/types/spec/layout.d';
import {RowCol} from 'vega-lite/src/vega.schema';
import {Resolve} from 'vega-lite/src/resolve';
import {ExprRef} from 'vega-lite/src/expr';
import {SignalRef} from 'vega-typings/types/spec/signal.d';
import {AutoSizeParams, Datasets} from 'vega-lite/src/spec/toplevel';
import {Config} from 'vega-lite/src/config';
import {Dict} from 'vega-lite/src/util';

class _Repeat extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  title(value: Text | TitleParams<ExprRef | SignalRef>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "title", value);
      return obj;
    } else {
      return get(this, "title");
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

  description(value: string) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "description", value);
      return obj;
    } else {
      return get(this, "description");
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

  transform(value: Transform[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "transform", value);
      return obj;
    } else {
      return get(this, "transform");
    }
  }

  align(value: LayoutAlign | RowCol<LayoutAlign>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "align", value);
      return obj;
    } else {
      return get(this, "align");
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

  spacing(value: number | RowCol<number>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "spacing", value);
      return obj;
    } else {
      return get(this, "spacing");
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

  columns(value: number) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "columns", value);
      return obj;
    } else {
      return get(this, "columns");
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

  background(value: string | ExprRef | SignalRef) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "background", value);
      return obj;
    } else {
      return get(this, "background");
    }
  }

  padding(value: ExprRef | SignalRef | Padding) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "padding", value);
      return obj;
    } else {
      return get(this, "padding");
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

  params(value: TopLevelParameter[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "params", value);
      return obj;
    } else {
      return get(this, "params");
    }
  }

  config(value: Config<ExprRef | SignalRef>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "config", value);
      return obj;
    } else {
      return get(this, "config");
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

export function _Repeat(...args) {
  return new _Repeat(...args);
}