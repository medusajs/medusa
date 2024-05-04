"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRatesStep = exports.createTaxRatesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createTaxRatesStepId = "create-tax-rates";
exports.createTaxRatesStep = (0, workflows_sdk_1.createStep)(exports.createTaxRatesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const created = await service.create(data);
    return new workflows_sdk_1.StepResponse(created, created.map((rate) => rate.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.delete(createdIds);
});
