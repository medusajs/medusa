"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuplicates = void 0;
// This function is intentionally not generic, as we will likely need a comparator function in that case, which will make it more complex than necessary
// Revisit if there is such use-case in the future
var getDuplicates = function (collection) {
    var uniqueElements = new Set();
    var duplicates = new Set();
    collection.forEach(function (item) {
        if (uniqueElements.has(item)) {
            duplicates.add(item);
        }
        else {
            uniqueElements.add(item);
        }
    });
    return Array.from(duplicates);
};
exports.getDuplicates = getDuplicates;
//# sourceMappingURL=get-duplicates.js.map