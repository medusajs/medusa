"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetDifference = void 0;
/**
 * Get the difference between two sets. The difference is the elements that are in the original set but not in the compare set.
 * @param orignalSet
 * @param compareSet
 */
function getSetDifference(orignalSet, compareSet) {
    var difference = new Set();
    orignalSet.forEach(function (element) {
        if (!compareSet.has(element)) {
            difference.add(element);
        }
    });
    return difference;
}
exports.getSetDifference = getSetDifference;
//# sourceMappingURL=get-set-difference.js.map