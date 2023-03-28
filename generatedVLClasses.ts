import {} from './utils'
import {BaseObject} from './__util__'

export class ValueDef extends BaseObject{
  constructor(args:  "bar | area | line"){
    super();
    }
}
export function valueDef(args: "bar | area | line"){
  return new ValueDef(args);
}