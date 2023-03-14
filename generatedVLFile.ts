export class Mark extends BaseObject {
    constructor(arg: "bar" | "area" | "line") { super(); }
    encode(values: string) { return values; }
}