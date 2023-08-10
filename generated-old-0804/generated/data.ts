import {BaseObject, copy, get, init, set} from './__util__';
import {AnyMark} from 'vega-lite/src/mark';
import {FacetedCompositeEncoding} from 'vega-lite/src/compositemark/index';
import {ExprRef} from 'vega-lite/src/expr';
import {Projection} from 'vega-lite/src/projection';
import {Transform, string} from '/Users/lvlanlan/Desktop/github_clone/apigen-try/node_modules/typescript/lib/lib.es5.d.ts';
import {TitleParams} from 'vega-lite/src/title';
import {Resolve} from 'vega-lite/src/resolve';
import {LayoutAlign} from 'vega-typings/types/spec/layout.d';
import {RowCol} from 'vega-lite/src/vega.schema';
import {Step, ViewBackground} from 'vega-lite/src/spec/base';
import {SignalRef} from 'vega-typings/types/spec/signal.d';
import {AutoSizeParams, Datasets} from 'vega-lite/src/spec/toplevel';
import {Config} from 'vega-lite/src/config';
import {Dict} from 'vega-lite/src/util';

class Data extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  mark(value: AnyMark) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "mark", value);
      return obj;
    } else {
      return get(this, "mark");
    }
  }

  encoding(value: FacetedCompositeEncoding<Field>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "encoding", value);
      return obj;
    } else {
      return get(this, "encoding");
    }
  }

  projection(value: Projection<ExprRef>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "projection", value);
      return obj;
    } else {
      return get(this, "projection");
    }
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

  transform(value: Transform[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "transform", value);
      return obj;
    } else {
      return get(this, "transform");
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

  view(value: ViewBackground<ExprRef | SignalRef>) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "view", value);
      return obj;
    } else {
      return get(this, "view");
    }
  }

  width(value: number | "container" | Step) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "width", value);
      return obj;
    } else {
      return get(this, "width");
    }
  }

  height(value: number | "container" | Step) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "height", value);
      return obj;
    } else {
      return get(this, "height");
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

export function data(...args) {
  return new Data(...args);
}