"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceListPricesStep = exports.createPriceListPricesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPriceListPricesStepId = "create-price-list-prices";
exports.createPriceListPricesStep = (0, workflows_sdk_1.createStep)(exports.createPriceListPricesStepId, async (stepInput, { container }) => {
    const { data, variant_price_map: variantPriceSetMap } = stepInput;
    const priceListPricesToCreate = [];
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    for (const createPriceListPricesData of data) {
        const { prices = [], id } = createPriceListPricesData;
        const pricesToAdd = [];
        for (const price of prices) {
            pricesToAdd.push({
                ...price,
                price_set_id: variantPriceSetMap[price.variant_id],
            });
        }
        if (pricesToAdd.length) {
            priceListPricesToCreate.push({
                price_list_id: id,
                prices: pricesToAdd,
            });
        }
    }
    const createdPrices = await pricingModule.addPriceListPrices(priceListPricesToCreate);
    return new workflows_sdk_1.StepResponse(createdPrices, createdPrices.map((p) => p.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    if (createdIds.length) {
        await pricingModule.removePrices(createdIds);
    }
});
