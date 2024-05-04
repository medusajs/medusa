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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShippingMethodTotals = exports.getShippingMethodsTotals = void 0;
var adjustment_1 = require("../adjustment");
var big_number_1 = require("../big-number");
var math_1 = require("../math");
var tax_1 = require("../tax");
function getShippingMethodsTotals(shippingMethods, context) {
    var e_1, _a;
    var _b;
    var includeTax = context.includeTax;
    var shippingMethodsTotals = {};
    var index = 0;
    try {
        for (var shippingMethods_1 = __values(shippingMethods), shippingMethods_1_1 = shippingMethods_1.next(); !shippingMethods_1_1.done; shippingMethods_1_1 = shippingMethods_1.next()) {
            var shippingMethod = shippingMethods_1_1.value;
            shippingMethodsTotals[(_b = shippingMethod.id) !== null && _b !== void 0 ? _b : index] = getShippingMethodTotals(shippingMethod, {
                includeTax: includeTax || shippingMethod.is_tax_inclusive,
            });
            index++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (shippingMethods_1_1 && !shippingMethods_1_1.done && (_a = shippingMethods_1.return)) _a.call(shippingMethods_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return shippingMethodsTotals;
}
exports.getShippingMethodsTotals = getShippingMethodsTotals;
function getShippingMethodTotals(shippingMethod, context) {
    var _a, _b, _c;
    var amount = math_1.MathBN.convert(shippingMethod.amount);
    var subtotal = math_1.MathBN.convert(shippingMethod.amount);
    var sumTaxRate = math_1.MathBN.sum.apply(math_1.MathBN, __spreadArray([], __read(((_b = (_a = shippingMethod.tax_lines) === null || _a === void 0 ? void 0 : _a.map(function (taxLine) { return taxLine.rate; })) !== null && _b !== void 0 ? _b : [])), false));
    var discountTotal = (0, adjustment_1.calculateAdjustmentTotal)({
        adjustments: shippingMethod.adjustments || [],
        includesTax: context.includeTax,
        taxRate: sumTaxRate,
    });
    var discountTaxTotal = math_1.MathBN.mult(discountTotal, math_1.MathBN.div(sumTaxRate, 100));
    var total = math_1.MathBN.sub(amount, discountTotal);
    var totals = {
        amount: new big_number_1.BigNumber(amount),
        subtotal: new big_number_1.BigNumber(subtotal),
        total: new big_number_1.BigNumber(total),
        original_total: new big_number_1.BigNumber(amount),
        discount_total: new big_number_1.BigNumber(discountTotal),
        discount_tax_total: new big_number_1.BigNumber(discountTaxTotal),
        tax_total: new big_number_1.BigNumber(0),
        original_tax_total: new big_number_1.BigNumber(0),
    };
    var taxLines = shippingMethod.tax_lines || [];
    var taxableAmountWithDiscount = math_1.MathBN.sub(subtotal, discountTotal);
    var taxableAmount = subtotal;
    var taxTotal = (0, tax_1.calculateTaxTotal)({
        taxLines: taxLines,
        includesTax: context.includeTax,
        taxableAmount: taxableAmountWithDiscount,
        setTotalField: "total",
    });
    totals.tax_total = new big_number_1.BigNumber(taxTotal);
    var originalTaxTotal = (0, tax_1.calculateTaxTotal)({
        taxLines: taxLines,
        includesTax: context.includeTax,
        taxableAmount: taxableAmount,
        setTotalField: "subtotal",
    });
    totals.original_tax_total = new big_number_1.BigNumber(originalTaxTotal);
    var isTaxInclusive = (_c = context.includeTax) !== null && _c !== void 0 ? _c : shippingMethod.is_tax_inclusive;
    if (isTaxInclusive) {
        var subtotal_1 = math_1.MathBN.add(shippingMethod.amount, taxTotal);
        totals.subtotal = new big_number_1.BigNumber(subtotal_1);
    }
    else {
        var originalTotal = math_1.MathBN.add(shippingMethod.amount, totals.original_tax_total);
        var total_1 = math_1.MathBN.add(totals.total, totals.tax_total);
        totals.total = new big_number_1.BigNumber(total_1);
        totals.original_total = new big_number_1.BigNumber(originalTotal);
    }
    return totals;
}
exports.getShippingMethodTotals = getShippingMethodTotals;
//# sourceMappingURL=index.js.map