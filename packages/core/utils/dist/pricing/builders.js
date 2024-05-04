"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPriceSetPricesForModule = exports.buildPriceSetPricesForCore = exports.buildPriceSetRules = exports.buildPriceListRules = void 0;
function buildPriceListRules(priceListRules) {
    return priceListRules === null || priceListRules === void 0 ? void 0 : priceListRules.reduce(function (acc, curr) {
        var ruleAttribute = curr.rule_type.rule_attribute;
        var ruleValues = curr.price_list_rule_values || [];
        acc[ruleAttribute] = ruleValues.map(function (ruleValue) { return ruleValue.value; });
        return acc;
    }, {});
}
exports.buildPriceListRules = buildPriceListRules;
function buildPriceSetRules(priceRules) {
    if (typeof priceRules === "undefined") {
        return undefined;
    }
    return priceRules === null || priceRules === void 0 ? void 0 : priceRules.reduce(function (acc, curr) {
        var ruleAttribute = curr.rule_type.rule_attribute;
        var ruleValue = curr.value;
        acc[ruleAttribute] = ruleValue;
        return acc;
    }, {});
}
exports.buildPriceSetRules = buildPriceSetRules;
function buildPriceSetPricesForCore(prices) {
    return prices === null || prices === void 0 ? void 0 : prices.map(function (price) {
        var _a, _b;
        var productVariant = (_a = price.price_set) === null || _a === void 0 ? void 0 : _a.variant;
        var rules = typeof price.price_rules === "undefined"
            ? undefined
            : buildPriceSetRules(price.price_rules || []);
        delete price.price_rules;
        delete price.price_set;
        return __assign(__assign({}, price), { variant_id: (_b = productVariant === null || productVariant === void 0 ? void 0 : productVariant.id) !== null && _b !== void 0 ? _b : undefined, rules: rules });
    });
}
exports.buildPriceSetPricesForCore = buildPriceSetPricesForCore;
function buildPriceSetPricesForModule(prices) {
    return prices === null || prices === void 0 ? void 0 : prices.map(function (price) {
        var _a;
        var rules = typeof price.price_rules === "undefined"
            ? undefined
            : buildPriceSetRules(price.price_rules || []);
        return __assign(__assign({}, price), { price_set_id: (_a = price.price_set) === null || _a === void 0 ? void 0 : _a.id, rules: rules });
    });
}
exports.buildPriceSetPricesForModule = buildPriceSetPricesForModule;
//# sourceMappingURL=builders.js.map