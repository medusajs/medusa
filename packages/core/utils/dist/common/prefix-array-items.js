"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixArrayItems = void 0;
/**
 * Prefixes an array of strings with a specified string
 * @param array
 * @param prefix
 */
function prefixArrayItems(array, prefix) {
    return array.map(function (arrEl) { return "".concat(prefix).concat(arrEl); });
}
exports.prefixArrayItems = prefixArrayItems;
//# sourceMappingURL=prefix-array-items.js.map