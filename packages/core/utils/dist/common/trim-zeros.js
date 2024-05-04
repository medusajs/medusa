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
exports.trimZeros = void 0;
function trimZeros(value) {
    var _a = __read(value.split("."), 2), whole = _a[0], fraction = _a[1];
    if (fraction) {
        var exp = fraction.split("e");
        var decimal = exp[0].replace(/0+$/, "");
        var expStr = exp.length > 1 ? "e".concat(exp[1]) : "";
        if (!decimal) {
            return whole + expStr;
        }
        return "".concat(whole, ".").concat(decimal) + expStr;
    }
    return whole;
}
exports.trimZeros = trimZeros;
//# sourceMappingURL=trim-zeros.js.map