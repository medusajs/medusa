"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRateRulesStep = exports.deleteTaxRateRulesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteTaxRateRulesStepId = "delete-tax-rate-rules";
exports.deleteTaxRateRulesStep = (0, workflows_sdk_1.createStep)(exports.deleteTaxRateRulesStepId, async (ids, { container }) => {
    if (!ids?.length) {
        return new workflows_sdk_1.StepResponse(void 0, []);
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.softDeleteTaxRateRules(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.restoreTaxRateRules(prevIds);
});
