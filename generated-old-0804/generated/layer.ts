import {BaseObject, copy, get, init, set} from './__util__';
import {Field} from 'vega-typings/types/spec/encode.d';
import {(LayerSpec | UnitSpec), TopLevelParameter, Transform, string} from '/Users/lvlanlan/Desktop/github_clone/apigen-try/node_modules/typescript/lib/lib.es5.d.ts';
import {SharedCompositeEncoding} from 'vega-lite/src/compositemark/index';
import {ExprRef} from 'vega-lite/src/expr';
import {Projection} from 'vega-lite/src/projection';
import {TitleParams} from 'vega-lite/src/title';
import {Data} from 'vega-lite/src/data';
import {Step, ViewBackground} from 'vega-lite/src/spec/base';
import {Resolve} from 'vega-lite/src/resolve';
import {SignalRef} from 'vega-typings/types/spec/signal.d';
import {AutoSizeParams, Datasets} from 'vega-lite/src/spec/toplevel';
import {Config} from 'vega-lite/src/config';
import {Dict} from 'vega-lite/src/util';

class Layer extends BaseObject {

  constructor(...args) {
    super();
    init(this);
  }

  layer(value: (LayerSpec<Field> | UnitSpec<Field>)[]) {
    if (arguments.length) {
      const obj = copy(this);
      set(obj, "layer", value);
      return obj;
    } else {
      return get(this, "layer");
    }
  }

  encoding(value: SharedCompositeEncoding<Field>) {
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

export function layer(...args) {
  return new Layer(...args);
}