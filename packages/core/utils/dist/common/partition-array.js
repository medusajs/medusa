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
exports.partitionArray = void 0;
/**
 * Partitions an array into two arrays based on a predicate function

 * @example
 * const result = partitionArray([1, 2, 3, 4, 5], (x) => x % 2 === 0)
 *
 * console.log(result)
 *
 * // output: [[2, 4], [1, 3, 5]]
 *
 * @param {T} input input array of type T
 * @param {(T) => boolean} predicate function to use when split array elements
 */
var partitionArray = function (input, predicate) {
    return input.reduce(function (_a, currentElement) {
        var _b = __read(_a, 2), pos = _b[0], neg = _b[1];
        if (predicate(currentElement)) {
            pos.push(currentElement);
        }
        else {
            neg.push(currentElement);
        }
        return [pos, neg];
    }, [[], []]);
};
exports.partitionArray = partitionArray;
//# sourceMappingURL=partition-array.js.map