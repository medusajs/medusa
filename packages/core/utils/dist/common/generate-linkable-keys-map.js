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
exports.generateLinkableKeysMap = void 0;
function generateLinkableKeysMap(linkableKeys) {
    var entityLinkableKeysMap = {};
    Object.entries(linkableKeys).forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        (_b = entityLinkableKeysMap[value]) !== null && _b !== void 0 ? _b : (entityLinkableKeysMap[value] = []);
        entityLinkableKeysMap[value].push({
            mapTo: key,
            valueFrom: key.split("_").pop(),
        });
    });
    return entityLinkableKeysMap;
}
exports.generateLinkableKeysMap = generateLinkableKeysMap;
//# sourceMappingURL=generate-linkable-keys-map.js.map