"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingOptionRulesStep = exports.createShippingOptionRulesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createShippingOptionRulesStepId = "create-shipping-option-rules";
exports.createShippingOptionRulesStep = (0, workflows_sdk_1.createStep)(exports.createShippingOptionRulesStepId, async (input, { container }) => {
    const { data } = input;
    const fulfillmentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const createdShippingOptionRules = await fulfillmentModule.createShippingOptionRules(data);
    return new workflows_sdk_1.StepResponse(createdShippingOptionRules, createdShippingOptionRules.map((pr) => pr.id));
}, async (ruleIds, { container }) => {
    if (!ruleIds?.length) {
        return;
    }
    const fulfillmentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await fulfillmentModule.deleteShippingOptionRules(ruleIds);
});
