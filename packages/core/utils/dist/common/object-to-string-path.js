"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToStringPath = void 0;
var is_object_1 = require("./is-object");
/**
 * Converts a structure of find options to an
 * array of string paths
 * @example
 * // With `includeTruePropertiesOnly` default value set to false
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * })
 * console.log(result)
 * // output: ['test', 'test.test1', 'test.test2', 'test.test3', 'test.test3.test4', 'test2']
 *
 * @example
 * // With `includeTruePropertiesOnly` set to true
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }, {
 *   includeTruePropertiesOnly: true
 * })
 * console.log(result)
 * // output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 *
 * @param {InputObject} input
 * @param {boolean} includeParentPropertyFields If set to true (example 1), all properties will be included as well as the parents,
 * otherwise (example 2) all properties path set to true will included, excluded the parents
 */
function objectToStringPath(input, _a) {
    var e_1, _b;
    if (input === void 0) { input = {}; }
    var _c = _a === void 0 ? {
        includeParentPropertyFields: true,
    } : _a, includeParentPropertyFields = _c.includeParentPropertyFields;
    if (!(0, is_object_1.isObject)(input) || !Object.keys(input).length) {
        return [];
    }
    var output = includeParentPropertyFields
        ? new Set(Object.keys(input))
        : new Set();
    var _loop_1 = function (key) {
        if ((0, is_object_1.isObject)(input[key])) {
            var deepRes = objectToStringPath(input[key], {
                includeParentPropertyFields: includeParentPropertyFields,
            });
            var items = deepRes.reduce(function (acc, val) {
                acc.push("".concat(key, ".").concat(val));
                return acc;
            }, []);
            items.forEach(function (item) { return output.add(item); });
            return "continue";
        }
        if ((0, is_object_1.isObject)(key) || input[key] === true) {
            output.add(key);
        }
    };
    try {
        for (var _d = __values(Object.keys(input)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var key = _e.value;
            _loop_1(key);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Array.from(output);
}
exports.objectToStringPath = objectToStringPath;
//# sourceMappingURL=object-to-string-path.js.map