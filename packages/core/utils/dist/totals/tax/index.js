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
exports.calculateTaxTotal = void 0;
var big_number_1 = require("../big-number");
var math_1 = require("../math");
function calculateTaxTotal(_a) {
    var e_1, _b;
    var taxLines = _a.taxLines, includesTax = _a.includesTax, taxableAmount = _a.taxableAmount, setTotalField = _a.setTotalField;
    var taxTotal = math_1.MathBN.convert(0);
    try {
        for (var taxLines_1 = __values(taxLines), taxLines_1_1 = taxLines_1.next(); !taxLines_1_1.done; taxLines_1_1 = taxLines_1.next()) {
            var taxLine = taxLines_1_1.value;
            var rate = math_1.MathBN.div(taxLine.rate, 100);
            var taxAmount = math_1.MathBN.mult(taxableAmount, rate);
            if (includesTax) {
                taxAmount = math_1.MathBN.div(taxAmount, math_1.MathBN.add(1, rate));
            }
            if (setTotalField) {
                ;
                taxLine[setTotalField] = new big_number_1.BigNumber(taxAmount);
            }
            taxTotal = math_1.MathBN.add(taxTotal, taxAmount);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (taxLines_1_1 && !taxLines_1_1.done && (_b = taxLines_1.return)) _b.call(taxLines_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return taxTotal;
}
exports.calculateTaxTotal = calculateTaxTotal;
//# sourceMappingURL=index.js.map