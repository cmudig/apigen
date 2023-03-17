export class Mark extends BaseObject {
    constructor(arg: "bar" | "area" | "line") { super(); init(this); }
    encode(values: string) { return values; }
}