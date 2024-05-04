"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayIntersection = void 0;
function arrayIntersection(firstArray, secondArray) {
    var firstArraySet = new Set(firstArray);
    var res = new Set();
    secondArray.forEach(function (element) {
        if (firstArraySet.has(element)) {
            res.add(element);
        }
    });
    return Array.from(res);
}
exports.arrayIntersection = arrayIntersection;
//# sourceMappingURL=array-intersection.js.map