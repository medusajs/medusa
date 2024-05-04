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
exports.calculateAdjustmentTotal = void 0;
var common_1 = require("../../common");
var big_number_1 = require("../big-number");
var math_1 = require("../math");
function calculateAdjustmentTotal(_a) {
    var e_1, _b;
    var adjustments = _a.adjustments, includesTax = _a.includesTax, taxRate = _a.taxRate;
    var total = math_1.MathBN.convert(0);
    try {
        for (var adjustments_1 = __values(adjustments), adjustments_1_1 = adjustments_1.next(); !adjustments_1_1.done; adjustments_1_1 = adjustments_1.next()) {
            var adj = adjustments_1_1.value;
            if (!(0, common_1.isDefined)(adj.amount)) {
                continue;
            }
            total = math_1.MathBN.add(total, adj.amount);
            if ((0, common_1.isDefined)(taxRate)) {
                var rate = math_1.MathBN.div(taxRate, 100);
                var taxAmount = math_1.MathBN.mult(adj.amount, rate);
                if (includesTax) {
                    taxAmount = math_1.MathBN.div(taxAmount, math_1.MathBN.add(1, rate));
                    adj["subtotal"] = new big_number_1.BigNumber(math_1.MathBN.sub(adj.amount, taxAmount));
                    adj["total"] = new big_number_1.BigNumber(adj.amount);
                }
                else {
                    adj["subtotal"] = new big_number_1.BigNumber(adj.amount);
                    adj["total"] = new big_number_1.BigNumber(math_1.MathBN.add(adj.amount, taxAmount));
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (adjustments_1_1 && !adjustments_1_1.done && (_b = adjustments_1.return)) _b.call(adjustments_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return total;
}
exports.calculateAdjustmentTotal = calculateAdjustmentTotal;
//# sourceMappingURL=index.js.map