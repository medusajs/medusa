"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceSetsStep = exports.createPriceSetsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPriceSetsStepId = "create-price-sets";
exports.createPriceSetsStep = (0, workflows_sdk_1.createStep)(exports.createPriceSetsStepId, async (data, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const priceSets = await pricingModule.create(data);
    return new workflows_sdk_1.StepResponse(priceSets, priceSets.map((priceSet) => priceSet.id));
}, async (priceSets, { container }) => {
    if (!priceSets?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.delete(priceSets);
});
