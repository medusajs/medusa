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
exports.selectorConstraintsToString = void 0;
function selectorConstraintsToString(selector) {
    var selectors = Array.isArray(selector) ? selector : [selector];
    return selectors
        .map(function (selector_) {
        return Object.entries(selector_)
            .map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return "".concat(key, ": ").concat(value._type ? "".concat(value._type, "(").concat(value._value, ")") : value);
        })
            .join(", ");
    })
        .join(" or ");
}
exports.selectorConstraintsToString = selectorConstraintsToString;
//# sourceMappingURL=selector-constraints-to-string.js.map