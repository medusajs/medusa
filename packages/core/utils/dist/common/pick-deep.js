"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickDeep = void 0;
var is_object_1 = require("./is-object");
function pickDeep(input, fields, prefix) {
    if (prefix === void 0) { prefix = ""; }
    if (!input) {
        return input;
    }
    return Object.entries(input).reduce(function (nextInput, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var fieldKey = withPrefix(key, prefix);
        var fieldMatches = fields.includes(fieldKey);
        var partialKeyMatch = fields.filter(function (field) { return field.toString().startsWith("".concat(fieldKey, ".")); })
            .length > 0;
        var valueIsObject = (0, is_object_1.isObject)(value);
        var valueIsArray = Array.isArray(value);
        if (fieldMatches && (valueIsObject || valueIsArray)) {
            nextInput[key] = value;
            return nextInput;
        }
        if (!fieldMatches && !partialKeyMatch) {
            return nextInput;
        }
        if (valueIsArray) {
            nextInput[key] = value.map(function (arrItem) {
                if ((0, is_object_1.isObject)(arrItem)) {
                    return pickDeep(arrItem, fields, withPrefix(key, prefix));
                }
                return arrItem;
            });
            return nextInput;
        }
        else if (valueIsObject) {
            if (Object.keys(value).length) {
                nextInput[key] = pickDeep(value, fields, withPrefix(key, prefix));
            }
            return nextInput;
        }
        if (fieldMatches) {
            nextInput[key] = value;
        }
        return nextInput;
    }, {});
}
exports.pickDeep = pickDeep;
function withPrefix(key, prefix) {
    if (prefix.length) {
        return "".concat(prefix, ".").concat(key);
    }
    else {
        return key;
    }
}
//# sourceMappingURL=pick-deep.js.map