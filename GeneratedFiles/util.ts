
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
export function toObject(value: Array<any> | BaseObject | Primitive): Array<any> | { [key: string]: any } | Primitive {
    if(isArray(value)){
        return value.map(d => recurse(d));
    } else if (typeof value === 'object' && value !== null) {
        const data = (value as BaseObject)[DataSymbol] || value;
        return isArray(data)
            ? recurse(data)
            : Object.keys(data).reduce<{ [key: string]: any }>((o, k) => {
                o[k] = recurse(data[k]);
                return o;
            }, {});
    } else {
        return value;
    }
}

export function duplicate(target: BaseObject, source: any) {
    return Object.assign(
      Object.create(Object.getPrototypeOf(target)),
      source
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

export function get(obj: BaseObject, name: string) {
    return obj[DataSymbol][name];
}

const isArray = Array.isArray;

export function recurse(d: any) {
    return d && d.toObject ? d.toObject(d[ContextSymbol] || 0) : toObject(d);
}

export function isObject(_: any) {
    return _ === Object(_) && !isArray(_);
}
