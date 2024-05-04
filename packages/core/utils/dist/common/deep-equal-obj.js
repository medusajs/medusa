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
exports.deepEqualObj = void 0;
function deepEqualObj(obj1, obj2) {
    var e_1, _a;
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    if (typeof obj1 !== "object" || obj1 === null) {
        return obj1 === obj2;
    }
    var obj1Keys = Object.keys(obj1);
    var obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }
    try {
        for (var obj1Keys_1 = __values(obj1Keys), obj1Keys_1_1 = obj1Keys_1.next(); !obj1Keys_1_1.done; obj1Keys_1_1 = obj1Keys_1.next()) {
            var key = obj1Keys_1_1.value;
            if (!obj2Keys.includes(key) || !deepEqualObj(obj1[key], obj2[key])) {
                return false;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (obj1Keys_1_1 && !obj1Keys_1_1.done && (_a = obj1Keys_1.return)) _a.call(obj1Keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
exports.deepEqualObj = deepEqualObj;
//# sourceMappingURL=deep-equal-obj.js.map