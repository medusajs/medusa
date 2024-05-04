"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRatesStep = exports.deleteTaxRatesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteTaxRatesStepId = "delete-tax-rates";
exports.deleteTaxRatesStep = (0, workflows_sdk_1.createStep)(exports.deleteTaxRatesStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.softDelete(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.restore(prevIds);
});
