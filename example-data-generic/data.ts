import {BaseObject, copy, get, init, isArray, isIterable, isString, raw, set} from './__util__';
import type {AutosizeType, AutoSizeParams} from 'vega-lite/src/spec/toplevel';
import type { TopLevelUnitSpec } from 'vega-lite/src/spec/unit';
import type { Field } from 'vega-lite/src/channeldef';

/**
 * Data class generated from type "TopLevelUnitSpec<Field>"
 */
class Data extends BaseObject<TopLevelUnitSpec<Field>> {

    constructor(value: TopLevelUnitSpec<Field>) {
        super();
        init(this);
        set(this, "data", value);
    }

    align(value: any) {
        if (arguments.length) {
            const obj = copy(this);
            set(obj, "align", value);
            return obj;
        } else {
        return get(this, "align");
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

    background(value: any) {
        if (arguments.length) {
            const obj = copy(this);
            set(obj, "background", value);
            return obj;
        } else {
            return get(this, "background");
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
}

export function data(value: any) {
    return new Data(value);
}

export function toSpec(obj: BaseObject<TopLevelUnitSpec<Field>>){
    return obj;
}

export function toJSON(obj: BaseObject<TopLevelUnitSpec<Field>>){
    var jsonString = JSON.stringify(obj.toObject());
    return jsonString;
}