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
exports.removeNullish = void 0;
var is_defined_1 = require("./is-defined");
function removeNullish(obj) {
    return Object.entries(obj).reduce(function (resultObject, _a) {
        var _b = __read(_a, 2), currentKey = _b[0], currentValue = _b[1];
        if (!(0, is_defined_1.isDefined)(currentValue) || currentValue === null) {
            return resultObject;
        }
        resultObject[currentKey] = currentValue;
        return resultObject;
    }, {});
}
exports.removeNullish = removeNullish;
//# sourceMappingURL=remove-nullisih.js.map