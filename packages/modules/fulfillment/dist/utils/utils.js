"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRules = exports.validateAndNormalizeRules = exports.normalizeRulesValue = exports.validateRule = exports.isContextValid = exports.availableOperators = void 0;
const utils_1 = require("@medusajs/utils");
exports.availableOperators = Object.values(utils_1.RuleOperator);
const isDate = (str) => {
    return !isNaN(Date.parse(str));
};
const operatorsPredicate = {
    in: (contextValue, ruleValue) => ruleValue.includes(contextValue),
    nin: (contextValue, ruleValue) => !ruleValue.includes(contextValue),
    eq: (contextValue, ruleValue) => contextValue === ruleValue,
    ne: (contextValue, ruleValue) => contextValue !== ruleValue,
    gt: (contextValue, ruleValue) => {
        if (isDate(contextValue) && isDate(ruleValue)) {
            return new Date(contextValue) > new Date(ruleValue);
        }
        return Number(contextValue) > Number(ruleValue);
    },
    gte: (contextValue, ruleValue) => {
        if (isDate(contextValue) && isDate(ruleValue)) {
            return new Date(contextValue) >= new Date(ruleValue);
        }
        return Number(contextValue) >= Number(ruleValue);
    },
    lt: (contextValue, ruleValue) => {
        if (isDate(contextValue) && isDate(ruleValue)) {
            return new Date(contextValue) < new Date(ruleValue);
        }
        return Number(contextValue) < Number(ruleValue);
    },
    lte: (contextValue, ruleValue) => {
        if (isDate(contextValue) && isDate(ruleValue)) {
            return new Date(contextValue) <= new Date(ruleValue);
        }
        return Number(contextValue) <= Number(ruleValue);
    },
};
/**
 * Validate contextValue context object from contextValue set of rules.
 * By default, all rules must be valid to return true unless the option atLeastOneValidRule is set to true.
 * @param context
 * @param rules
 * @param options
 */
function isContextValid(context, rules, options = {
    someAreValid: false,
}) {
    const { someAreValid } = options;
    const loopComparator = someAreValid ? rules.some : rules.every;
    const predicate = (rule) => {
        const { attribute, operator, value } = rule;
        const contextValue = (0, utils_1.pickValueFromObject)(attribute, context);
        return operatorsPredicate[operator](contextValue, value);
    };
    return loopComparator.apply(rules, [predicate]);
}
exports.isContextValid = isContextValid;
/**
 * Validate contextValue rule object
 * @param rule
 */
function validateRule(rule) {
    if (!rule.attribute || !rule.operator || !rule.value) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Rule must have an attribute, an operator and a value");
    }
    if (!(0, utils_1.isString)(rule.attribute)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Rule attribute must be a string");
    }
    if (!(0, utils_1.isString)(rule.operator)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Rule operator must be a string");
    }
    if (!exports.availableOperators.includes(rule.operator)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Rule operator ${rule.operator} is not supported. Must be one of ${exports.availableOperators.join(", ")}`);
    }
    if (rule.operator === utils_1.RuleOperator.IN || rule.operator === utils_1.RuleOperator.NIN) {
        if (!Array.isArray(rule.value)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Rule value must be an array for in/nin operators");
        }
    }
    else {
        if (Array.isArray(rule.value) || (0, utils_1.isObject)(rule.value)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Rule value must be a string, bool, number value for the selected operator ${rule.operator}`);
        }
    }
    return true;
}
exports.validateRule = validateRule;
function normalizeRulesValue(rules) {
    rules.forEach((rule) => {
        /**
         * If a string is provided, then we don't want jsonb to convert to the primitive value based on the RFC
         */
        if (rule.value === "true" || rule.value === "false") {
            rule.value = rule.value === "true" ? '"true"' : '"false"';
        }
        return rule;
    });
}
exports.normalizeRulesValue = normalizeRulesValue;
function validateAndNormalizeRules(rules) {
    rules.forEach(validateRule);
    normalizeRulesValue(rules);
}
exports.validateAndNormalizeRules = validateAndNormalizeRules;
/**
 * Validate contextValue set of rules
 * @param rules
 */
function validateRules(rules) {
    rules.forEach(validateRule);
    return true;
}
exports.validateRules = validateRules;
