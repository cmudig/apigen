import {BaseObject, get, init, merge, set} from './__util__'

class Mark extends BaseObject{
  constructor(...args:  "bar" | "area" | "line")
    super();
    init(this);
    }
}
export function Mark(...args: "bar" | "area" | "line"){
  return new Mark(...args);
}
class FieldDef extends BaseObject{
  constructor(...args:  )
    super();
    init(this);
    }
}
export function FieldDef(...args: ){
  return new FieldDef(...args);
}