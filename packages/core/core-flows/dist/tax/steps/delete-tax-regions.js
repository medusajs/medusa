"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRegionsStep = exports.deleteTaxRegionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteTaxRegionsStepId = "delete-tax-regions";
exports.deleteTaxRegionsStep = (0, workflows_sdk_1.createStep)(exports.deleteTaxRegionsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.softDeleteTaxRegions(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.restoreTaxRegions(prevIds);
});
