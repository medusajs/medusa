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
exports.getLineItemsTotals = void 0;
var adjustment_1 = require("../adjustment");
var big_number_1 = require("../big-number");
var math_1 = require("../math");
var tax_1 = require("../tax");
function getLineItemsTotals(items, context) {
    var e_1, _a;
    var _b;
    var itemsTotals = {};
    var index = 0;
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            itemsTotals[(_b = item.id) !== null && _b !== void 0 ? _b : index] = getLineItemTotals(item, {
                includeTax: context.includeTax || item.is_tax_inclusive,
            });
            index++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return itemsTotals;
}
exports.getLineItemsTotals = getLineItemsTotals;
function getLineItemTotals(item, context) {
    var _a, _b, _c;
    var subtotal = math_1.MathBN.mult(item.unit_price, item.quantity);
    var sumTaxRate = math_1.MathBN.sum.apply(math_1.MathBN, __spreadArray([], __read(((_b = ((_a = item.tax_lines) !== null && _a !== void 0 ? _a : []).map(function (taxLine) { return taxLine.rate; })) !== null && _b !== void 0 ? _b : [])), false));
    var discountTotal = (0, adjustment_1.calculateAdjustmentTotal)({
        adjustments: item.adjustments || [],
        includesTax: context.includeTax,
        taxRate: sumTaxRate,
    });
    var discountTaxTotal = math_1.MathBN.mult(discountTotal, math_1.MathBN.div(sumTaxRate, 100));
    var total = math_1.MathBN.sub(subtotal, discountTotal);
    var totals = {
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: new big_number_1.BigNumber(subtotal),
        total: new big_number_1.BigNumber(total),
        original_total: new big_number_1.BigNumber(subtotal),
        discount_total: new big_number_1.BigNumber(discountTotal),
        discount_tax_total: new big_number_1.BigNumber(discountTaxTotal),
        tax_total: new big_number_1.BigNumber(0),
        original_tax_total: new big_number_1.BigNumber(0),
    };
    var taxableAmountWithDiscount = math_1.MathBN.sub(subtotal, discountTotal);
    var taxableAmount = subtotal;
    var taxTotal = (0, tax_1.calculateTaxTotal)({
        taxLines: item.tax_lines || [],
        includesTax: context.includeTax,
        taxableAmount: taxableAmountWithDiscount,
        setTotalField: "total",
    });
    totals.tax_total = new big_number_1.BigNumber(taxTotal);
    var originalTaxTotal = (0, tax_1.calculateTaxTotal)({
        taxLines: item.tax_lines || [],
        includesTax: context.includeTax,
        taxableAmount: taxableAmount,
        setTotalField: "subtotal",
    });
    totals.original_tax_total = new big_number_1.BigNumber(originalTaxTotal);
    var isTaxInclusive = (_c = context.includeTax) !== null && _c !== void 0 ? _c : item.is_tax_inclusive;
    if (isTaxInclusive) {
        totals.subtotal = new big_number_1.BigNumber(math_1.MathBN.sub(math_1.MathBN.mult(item.unit_price, totals.quantity), originalTaxTotal));
    }
    else {
        var newTotal = math_1.MathBN.add(total, totals.tax_total);
        var originalTotal = math_1.MathBN.add(subtotal, totals.original_tax_total);
        totals.total = new big_number_1.BigNumber(newTotal);
        totals.original_total = new big_number_1.BigNumber(originalTotal);
    }
    return totals;
}
//# sourceMappingURL=index.js.map