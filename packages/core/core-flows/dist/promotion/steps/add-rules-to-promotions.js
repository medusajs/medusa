"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRulesToPromotionsStep = exports.addRulesToPromotionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.addRulesToPromotionsStepId = "add-rules-to-promotions";
exports.addRulesToPromotionsStep = (0, workflows_sdk_1.createStep)(exports.addRulesToPromotionsStepId, async (input, { container }) => {
    const { data, rule_type: ruleType } = input;
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const createdPromotionRules = ruleType === utils_1.RuleType.RULES
        ? await promotionModule.addPromotionRules(data.id, data.rules)
        : [];
    const createdPromotionBuyRules = ruleType === utils_1.RuleType.BUY_RULES
        ? await promotionModule.addPromotionBuyRules(data.id, data.rules)
        : [];
    const createdPromotionTargetRules = ruleType === utils_1.RuleType.TARGET_RULES
        ? await promotionModule.addPromotionTargetRules(data.id, data.rules)
        : [];
    const promotionRules = [
        ...createdPromotionRules,
        ...createdPromotionBuyRules,
        ...createdPromotionTargetRules,
    ];
    return new workflows_sdk_1.StepResponse(promotionRules, {
        id: data.id,
        promotionRuleIds: createdPromotionRules.map((pr) => pr.id),
        buyRuleIds: createdPromotionBuyRules.map((pr) => pr.id),
        targetRuleIds: createdPromotionBuyRules.map((pr) => pr.id),
    });
}, async (data, { container }) => {
    if (!data) {
        return;
    }
    const { id, promotionRuleIds = [], buyRuleIds = [], targetRuleIds = [], } = data;
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    promotionRuleIds.length &&
        (await promotionModule.removePromotionRules(id, promotionRuleIds));
    buyRuleIds.length &&
        (await promotionModule.removePromotionBuyRules(id, buyRuleIds));
    targetRuleIds.length &&
        (await promotionModule.removePromotionBuyRules(id, targetRuleIds));
});
