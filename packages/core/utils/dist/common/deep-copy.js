"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = void 0;
var is_object_1 = require("./is-object");
/**
 * In most casees, JSON.parse(JSON.stringify(obj)) is enough to deep copy an object.
 * But in some cases, it's not enough. For example, if the object contains a function or a proxy, it will be lost after JSON.parse(JSON.stringify(obj)).
 *
 * @param obj
 */
function deepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        var copy = [];
        for (var i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    if ((0, is_object_1.isObject)(obj)) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = deepCopy(obj[attr]);
            }
        }
        return copy;
    }
    return obj;
}
exports.deepCopy = deepCopy;
//# sourceMappingURL=deep-copy.js.map