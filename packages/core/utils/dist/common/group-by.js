"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
function groupBy(array, attribute) {
    return array.reduce(function (map, obj) {
        var key = obj[attribute];
        if (!key) {
            return map;
        }
        if (!map.get(key)) {
            map.set(key, []);
        }
        map.get(key).push(obj);
        return map;
    }, new Map());
}
exports.groupBy = groupBy;
//# sourceMappingURL=group-by.js.map