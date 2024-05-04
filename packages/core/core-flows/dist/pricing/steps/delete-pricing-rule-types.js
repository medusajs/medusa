"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePricingRuleTypesStep = exports.deletePricingRuleTypesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deletePricingRuleTypesStepId = "delete-pricing-rule-types";
exports.deletePricingRuleTypesStep = (0, workflows_sdk_1.createStep)(exports.deletePricingRuleTypesStepId, async (ids, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    // TODO: implement soft deleting rule types
    // await pricingModule.softDeleteRuleTypes(ids)
    await pricingModule.deleteRuleTypes(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    // TODO: implement restoring soft deleted rule types
    // await pricingModule.restoreRuleTypes(ids)
});
