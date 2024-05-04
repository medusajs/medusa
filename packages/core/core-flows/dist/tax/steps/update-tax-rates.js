"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaxRatesStep = exports.updateTaxRatesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateTaxRatesStepId = "update-tax-rates";
exports.updateTaxRatesStep = (0, workflows_sdk_1.createStep)(exports.updateTaxRatesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const taxRates = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(taxRates, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    await service.upsert(prevData);
});
