"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRuleValueCondition = exports.areRulesValidForContext = exports.validatePromotionRuleAttributes = void 0;
const utils_1 = require("@medusajs/utils");
function validatePromotionRuleAttributes(promotionRulesData) {
    const errors = [];
    for (const promotionRuleData of promotionRulesData) {
        if (!(0, utils_1.isPresent)(promotionRuleData.attribute)) {
            errors.push("rules[].attribute is a required field");
        }
        if (!(0, utils_1.isPresent)(promotionRuleData.operator)) {
            errors.push("rules[].operator is a required field");
        }
        if ((0, utils_1.isPresent)(promotionRuleData.operator)) {
            const allowedOperators = Object.values(utils_1.PromotionRuleOperator);
            if (!allowedOperators.includes(promotionRuleData.operator)) {
                errors.push(`rules[].operator (${promotionRuleData.operator}) is invalid. It should be one of ${allowedOperators.join(", ")}`);
            }
        }
        else {
            errors.push("rules[].operator is a required field");
        }
    }
    if (!errors.length)
        return;
    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, errors.join(", "));
}
exports.validatePromotionRuleAttributes = validatePromotionRuleAttributes;
function areRulesValidForContext(rules, context) {
    return rules.every((rule) => {
        const validRuleValues = rule.values?.map((ruleValue) => ruleValue.value);
        if (!rule.attribute) {
            return false;
        }
        const valuesToCheck = (0, utils_1.pickValueFromObject)(rule.attribute, context);
        return evaluateRuleValueCondition(validRuleValues.filter(utils_1.isString), rule.operator, valuesToCheck);
    });
}
exports.areRulesValidForContext = areRulesValidForContext;
function evaluateRuleValueCondition(ruleValues, operator, ruleValuesToCheck) {
    if (!Array.isArray(ruleValuesToCheck)) {
        ruleValuesToCheck = [ruleValuesToCheck];
    }
    return ruleValuesToCheck.every((ruleValueToCheck) => {
        if (operator === "in" || operator === "eq") {
            return ruleValues.some((ruleValue) => ruleValue === ruleValueToCheck);
        }
        if (operator === "ne") {
            return ruleValues.some((ruleValue) => ruleValue !== ruleValueToCheck);
        }
        if (operator === "gt") {
            return ruleValues.some((ruleValue) => ruleValue > ruleValueToCheck);
        }
        if (operator === "gte") {
            return ruleValues.some((ruleValue) => ruleValue >= ruleValueToCheck);
        }
        if (operator === "lt") {
            return ruleValues.some((ruleValue) => ruleValue < ruleValueToCheck);
        }
        if (operator === "lte") {
            return ruleValues.some((ruleValue) => ruleValue <= ruleValueToCheck);
        }
        return false;
    });
}
exports.evaluateRuleValueCondition = evaluateRuleValueCondition;
