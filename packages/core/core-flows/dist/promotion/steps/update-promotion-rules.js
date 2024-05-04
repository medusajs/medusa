"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromotionRulesStep = exports.updatePromotionRulesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePromotionRulesStepId = "update-promotion-rules";
exports.updatePromotionRulesStep = (0, workflows_sdk_1.createStep)(exports.updatePromotionRulesStepId, async (input, { container }) => {
    const { data } = input;
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const promotionRulesBeforeUpdate = await promotionModule.listPromotionRules({ id: data.map((d) => d.id) }, { relations: ["values"] });
    const updatedPromotionRules = await promotionModule.updatePromotionRules(data);
    return new workflows_sdk_1.StepResponse(updatedPromotionRules, promotionRulesBeforeUpdate);
}, async (updatedPromotionRules, { container }) => {
    if (!updatedPromotionRules?.length) {
        return;
    }
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    await promotionModule.updatePromotionRules(updatedPromotionRules.map((rule) => ({
        id: rule.id,
        description: rule.description,
        attribute: rule.attribute,
        operator: rule.operator,
        values: rule.values.map((v) => v.value),
    })));
});
