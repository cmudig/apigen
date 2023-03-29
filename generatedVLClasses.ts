import {} from './utils'

export class Mark{
  constructor(private mark:  "bar | area | line"){
    }
}
export function mark(mark : "bar | area | line"){
  return new Mark(mark);
}