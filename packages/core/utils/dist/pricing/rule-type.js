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
exports.validateRuleAttributes = exports.getInvalidRuleAttributes = exports.ReservedPricingRuleAttributes = void 0;
var common_1 = require("../common");
exports.ReservedPricingRuleAttributes = [
    "quantity",
    "currency_code",
    "price_list_id",
];
var getInvalidRuleAttributes = function (ruleAttributes) {
    var e_1, _a;
    var invalidRuleAttributes = [];
    try {
        for (var ReservedPricingRuleAttributes_1 = __values(exports.ReservedPricingRuleAttributes), ReservedPricingRuleAttributes_1_1 = ReservedPricingRuleAttributes_1.next(); !ReservedPricingRuleAttributes_1_1.done; ReservedPricingRuleAttributes_1_1 = ReservedPricingRuleAttributes_1.next()) {
            var attribute = ReservedPricingRuleAttributes_1_1.value;
            if (ruleAttributes.indexOf(attribute) > -1) {
                invalidRuleAttributes.push(attribute);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (ReservedPricingRuleAttributes_1_1 && !ReservedPricingRuleAttributes_1_1.done && (_a = ReservedPricingRuleAttributes_1.return)) _a.call(ReservedPricingRuleAttributes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return invalidRuleAttributes;
};
exports.getInvalidRuleAttributes = getInvalidRuleAttributes;
var validateRuleAttributes = function (ruleAttributes) {
    var invalidRuleAttributes = (0, exports.getInvalidRuleAttributes)(ruleAttributes);
    if (invalidRuleAttributes.length) {
        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_DATA, "Can't create rule_attribute with reserved keywords [".concat(exports.ReservedPricingRuleAttributes.join(", "), "] - ").concat(invalidRuleAttributes.join(", ")));
    }
};
exports.validateRuleAttributes = validateRuleAttributes;
//# sourceMappingURL=rule-type.js.map