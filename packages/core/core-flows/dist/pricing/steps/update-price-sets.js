"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePriceSetsStep = exports.updatePriceSetsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePriceSetsStepId = "update-price-sets";
exports.updatePriceSetsStep = (0, workflows_sdk_1.createStep)(exports.updatePriceSetsStepId, async (data, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    if ("price_sets" in data) {
        if (data.price_sets.some((p) => !p.id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Price set id is required when doing a batch update");
        }
        const prevData = await pricingModule.list({
            id: data.price_sets.map((p) => p.id),
        });
        const priceSets = await pricingModule.upsert(data.price_sets);
        return new workflows_sdk_1.StepResponse(priceSets, prevData);
    }
    if (!data.selector || !data.update) {
        return new workflows_sdk_1.StepResponse([], null);
    }
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const dataBeforeUpdate = await pricingModule.list(data.selector, {
        select: selects,
        relations,
    });
    const updatedPriceSets = await pricingModule.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(updatedPriceSets, dataBeforeUpdate);
}, async (revertInput, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    if (!revertInput) {
        return;
    }
    await pricingModule.upsert(revertInput);
});
