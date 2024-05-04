"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRegionsStep = exports.createTaxRegionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createTaxRegionsStepId = "create-tax-regions";
exports.createTaxRegionsStep = (0, workflows_sdk_1.createStep)(exports.createTaxRegionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const created = await service.createTaxRegions(data);
    return new workflows_sdk_1.StepResponse(created, created.map((region) => region.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.delete(createdIds);
});
