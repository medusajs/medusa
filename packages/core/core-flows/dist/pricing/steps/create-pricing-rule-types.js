"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPricingRuleTypesStep = exports.createPricingRuleTypesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPricingRuleTypesStepId = "create-pricing-rule-types";
exports.createPricingRuleTypesStep = (0, workflows_sdk_1.createStep)(exports.createPricingRuleTypesStepId, async (data, { container }) => {
    if (!data?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const existingRuleTypes = await pricingModule.listRuleTypes({
        rule_attribute: data.map((d) => d.rule_attribute),
    });
    const existingRuleTypeAttributes = new Set(existingRuleTypes.map((ruleType) => ruleType.rule_attribute));
    const ruleTypesToCreate = data.filter((dataItem) => !existingRuleTypeAttributes.has(dataItem.rule_attribute));
    const ruleTypes = await pricingModule.createRuleTypes(ruleTypesToCreate);
    return new workflows_sdk_1.StepResponse(ruleTypes, ruleTypes.map((ruleType) => ruleType.id));
}, async (ruleTypeIds, { container }) => {
    if (!ruleTypeIds?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.delete(ruleTypeIds);
});
