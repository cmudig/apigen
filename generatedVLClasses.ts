import {} from './utils'

class Mark {
    constructor(private type: "bar" | "area" | "line") {}
    
}
  
export function mark(type: "bar" | "area" | "line"){
    return new Mark(type);
}

class Spec {
    constructor(private mark: Mark) {}
    
}
  
export function spec(mark: Mark){
    return new Spec(mark);
}

export function toSpec(obj: any){
    return JSON.stringify(obj);
}
