"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRateRulesStep = exports.createTaxRateRulesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createTaxRateRulesStepId = "create-tax-rate-rules";
exports.createTaxRateRulesStep = (0, workflows_sdk_1.createStep)(exports.createTaxRateRulesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const created = await service.createTaxRateRules(data);
    return new workflows_sdk_1.StepResponse(created, created.map((rule) => rule.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.deleteTaxRateRules(createdIds);
});
