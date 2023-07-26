
const DataSymbol = Symbol("data");
const ContextSymbol = Symbol('context');

export class BaseObject {
    [DataSymbol]?: any;

    toObject() {
        return toObject(this);
    }
}

type Primitive = string | number | boolean | symbol;
// type Primitive = string | number | boolean | symbol | undefined | null; // TODO: consider whether will we have undefined and null
// export function toObject(value: Array<any> | BaseObject | Primitive): Array<any> | { [key: string]: any } | Primitive {
//     if(isArray(value)){
//         return value.map(d => recurse(d));
//     } else if (typeof value === 'object' && value !== null) {
//         const data = (value as BaseObject)[DataSymbol] || value;
//         return isArray(data)
//             ? recurse(data)
//             : Object.keys(data).reduce<{ [key: string]: any }>((o, k) => {
//                 o[k] = recurse(data[k]);
//                 return o;
//             }, {});
//     } else {
//         return value;
//     }
// }

export function toObject(value: any): any {
    if (isArray(value)) {
        return value.map(d => recurse(d));
    } else if (isObject(value)) {
        const data = value[DataSymbol] || value;
        return isArray(data)
            ? recurse(data)
            : Object.keys(data).reduce<{[key: string]: any}>((_, k) => {
                _[k] = recurse(data[k]);
                return _;
            }, {});
    } else {
      return value;
    }
}

// export function duplicate(target: BaseObject, source: any) {
//     return Object.assign(
//       Object.create(Object.getPrototypeOf(target)),
//       source
//     );
// }

export function duplicate(...obj: any) {
    return Object.assign(
      Object.create(Object.getPrototypeOf(obj[0])),
      ...obj
    );
}

export function init(obj: BaseObject, value?: any) {
    obj[DataSymbol] = value || {};
}

export function copy(obj: BaseObject) {
    return duplicate(obj, { [DataSymbol]: Object.assign({}, obj[DataSymbol]) });
}

/**
 * Trun the value into an object with DataSymbol property
 * @param value 
 * @returns if value is an object or value has DataSymbol, return a new object with a DataSymbol property, otherwise return value
 */
export function object(value: any) {
    return (isObject(value) && !value[DataSymbol]) ? {[DataSymbol]: value || {}} : value;
}  

/**
 * Set properites of obj[DataSymbol][name] to a value object
 * @param obj the object that we are going to set
 * @param name name of the property
 * @param value value of the property
 */
export function set(obj: BaseObject, name: any, value: any) {
    obj[DataSymbol][name] = object(value);
}

export function get(obj: BaseObject, name: string): any {
    return obj[DataSymbol][name];
}

export function recurse(d: any) {
    return d && d.toObject ? d.toObject(d[ContextSymbol] || 0) : toObject(d);
}

export function isObject(_: any) {
    return _ === Object(_) && !isArray(_);
}

/**
 * Merged objects
 */
export class MergeObject {
    [DataSymbol]?: any;

    constructor(values: any) { this[DataSymbol] = values; }
    toObject() { return Object.assign({}, ...recurse(this[DataSymbol])); }
}

/**
 * Merge objects into one object
 * @param flag 0 no need to flag each object, 1 annotate each object with context
 * @param values object lists that are going to be merged
 * @returns merged object
 */
export function merge(flag: any, ...values: any) {
    const objects = [].concat(...values);
    return new MergeObject(flag ? annotate(objects, flag) : objects);
}

export function annotate(value: any, context: any) {
    const ctx = { [ContextSymbol]: context };
    return isArray(value)
      ? value.map(v => duplicate(v, ctx))
      : duplicate(value, ctx)
}

export function raw(value: any) {
    return { [DataSymbol]: value, toObject: () => value };
}

export const isArray = Array.isArray;

export function isString(_: any) {
    return typeof _ === 'string';
}

export function isIterable(_: any) {
    return isObject(_) && typeof _[Symbol.iterator] === 'function';
}

export function assign(target: any, ...sources: any[]) {
    if (sources.length === 1 && Array.isArray(sources[0])) {
        target[DataSymbol] = sources[0];
    } else {
        sources.forEach(s => {
            Object.assign(target[DataSymbol], isObject(s) && s[DataSymbol] || s)
        });
    }
    return target;
}