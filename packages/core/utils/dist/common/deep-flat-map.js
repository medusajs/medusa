"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepFlatMap = void 0;
var is_defined_1 = require("./is-defined");
var is_object_1 = require("./is-object");
/**
 * @description
 * This function is used to flatten nested objects and arrays
 *
 * @example
 *
 * ```ts
 * const data = {
 *   root_level_property: "root level",
 *   products: [
 *     {
 *       id: "1",
 *       name: "product 1",
 *       variants: [
 *         { id: "1.1", name: "variant 1.1" },
 *         { id: "1.2", name: "variant 1.2" },
 *       ],
 *     },
 *     {
 *       id: "2",
 *       name: "product 2",
 *       variants: [
 *         { id: "2.1", name: "variant 2.1" },
 *         { id: "2.2", name: "variant 2.2" },
 *       ],
 *     },
 *   ],
 * }
 *
 * const flat = deepFlatMap(
 *   data,
 *   "products.variants",
 *   ({ root_, products, variants }) => {
 *     return {
 *       root_level_property: root_.root_level_property,
 *       product_id: products.id,
 *       product_name: products.name,
 *       variant_id: variants.id,
 *       variant_name: variants.name,
 *     }
 *   }
 * )
 * ```
 */
function deepFlatMap(data, path, callback) {
    var _a;
    var ROOT_LEVEL = "root_";
    var keys = path.split(".");
    keys.unshift(ROOT_LEVEL);
    var lastKey = keys[keys.length - 1];
    var stack = [{ element: (_a = {}, _a[ROOT_LEVEL] = data, _a), path: keys, context: {} }];
    var results = [];
    var _loop_1 = function () {
        var _b, _c;
        var _d = stack.shift(), element = _d.element, path_1 = _d.path, context = _d.context;
        var currentKey = path_1[0];
        var remainingPath = path_1.slice(1);
        if (!(0, is_defined_1.isDefined)(element[currentKey])) {
            callback(__assign({}, context));
            return "continue";
        }
        if (remainingPath.length === 0) {
            if (Array.isArray(element[currentKey])) {
                element[currentKey].forEach(function (item) {
                    var _a;
                    results.push(callback(__assign(__assign({}, context), (_a = {}, _a[lastKey] = item, _a))));
                });
            }
            else if ((0, is_object_1.isObject)(element[currentKey])) {
                results.push(callback(__assign(__assign({}, context), (_b = {}, _b[lastKey] = element[currentKey], _b))));
            }
        }
        else {
            if (Array.isArray(element[currentKey])) {
                element[currentKey].forEach(function (item) {
                    var _a;
                    stack.push({
                        element: item,
                        path: remainingPath,
                        context: __assign(__assign({}, context), (_a = {}, _a[currentKey] = item, _a)),
                    });
                });
            }
            else if ((0, is_object_1.isObject)(element[currentKey])) {
                stack.push({
                    element: element[currentKey],
                    path: remainingPath,
                    context: __assign(__assign({}, context), (_c = {}, _c[currentKey] = element[currentKey], _c)),
                });
            }
        }
    };
    while (stack.length > 0) {
        _loop_1();
    }
    return results;
}
exports.deepFlatMap = deepFlatMap;
//# sourceMappingURL=deep-flat-map.js.map