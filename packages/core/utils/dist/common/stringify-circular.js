"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyCircular = void 0;
var isObject = function (value) {
    return typeof value === "object" &&
        value != null &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String);
};
var isPrimitive = function (val) {
    return val !== Object(val);
};
function decycle(object, replacer) {
    var objects = new WeakMap();
    function deepCopy(value, path) {
        var oldPath;
        var newObj;
        if (replacer != null) {
            value = replacer(value);
        }
        if (isObject(value)) {
            oldPath = objects.get(value);
            if (oldPath !== undefined) {
                return { $ref: oldPath };
            }
            objects.set(value, path);
            if (Array.isArray(value)) {
                newObj = [];
                value.forEach(function (el, idx) {
                    newObj[idx] = deepCopy(el, path + "[" + idx + "]");
                });
            }
            else {
                newObj = {};
                Object.keys(value).forEach(function (name) {
                    newObj[name] = deepCopy(value[name], path + "[" + JSON.stringify(name) + "]");
                });
            }
            return newObj;
        }
        return !isPrimitive(value) ? value + "" : value;
    }
    return deepCopy(object, "$");
}
function stringifyCircular(object, replacer, space) {
    return JSON.stringify(decycle(object, replacer), null, space);
}
exports.stringifyCircular = stringifyCircular;
//# sourceMappingURL=stringify-circular.js.map