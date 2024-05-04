"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRulesFromPromotionsStep = exports.removeRulesFromPromotionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.removeRulesFromPromotionsStepId = "remove-rules-from-promotions";
exports.removeRulesFromPromotionsStep = (0, workflows_sdk_1.createStep)(exports.removeRulesFromPromotionsStepId, async (input, { container }) => {
    const { data, rule_type: ruleType } = input;
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const promotion = await promotionModule.retrieve(data.id, {
        relations: [
            "rules.values",
            "application_method.target_rules.values",
            "application_method.buy_rules.values",
        ],
    });
    const promotionRulesToCreate = [];
    const buyRulesToCreate = [];
    const targetRulesToCreate = [];
    if (ruleType === utils_1.RuleType.RULES) {
        const rules = promotion.rules;
        promotionRulesToCreate.push(...promotionRuleAttribute(rules));
        await promotionModule.removePromotionRules(data.id, data.rule_ids);
    }
    if (ruleType === utils_1.RuleType.BUY_RULES) {
        const rules = promotion.application_method?.buy_rules;
        buyRulesToCreate.push(...promotionRuleAttribute(rules));
        await promotionModule.removePromotionBuyRules(data.id, data.rule_ids);
    }
    if (ruleType === utils_1.RuleType.TARGET_RULES) {
        const rules = promotion.application_method?.target_rules;
        targetRulesToCreate.push(...promotionRuleAttribute(rules));
        await promotionModule.removePromotionTargetRules(data.id, data.rule_ids);
    }
    return new workflows_sdk_1.StepResponse(null, {
        id: data.id,
        promotionRulesToCreate,
        buyRulesToCreate,
        targetRulesToCreate,
    });
}, async (data, { container }) => {
    if (!data) {
        return;
    }
    const { id, promotionRulesToCreate = [], buyRulesToCreate = [], targetRulesToCreate = [], } = data;
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    promotionRulesToCreate.length &&
        (await promotionModule.addPromotionRules(id, promotionRulesToCreate));
    buyRulesToCreate.length &&
        (await promotionModule.addPromotionBuyRules(id, buyRulesToCreate));
    targetRulesToCreate.length &&
        (await promotionModule.addPromotionBuyRules(id, targetRulesToCreate));
});
function promotionRuleAttribute(rules) {
    return rules.map((rule) => ({
        description: rule.description,
        attribute: rule.attribute,
        operator: rule.operator,
        values: rule.values.map((val) => val.value),
    }));
}
