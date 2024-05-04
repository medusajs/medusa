"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePriceListsStep = exports.deletePriceListsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deletePriceListsStepId = "delete-campaigns";
exports.deletePriceListsStep = (0, workflows_sdk_1.createStep)(exports.deletePriceListsStepId, async (ids, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.softDeletePriceLists(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.restorePriceLists(idsToRestore);
});
