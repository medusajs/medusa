"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePriceListPricesStep = exports.updatePriceListPricesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePriceListPricesStepId = "update-price-list-prices";
exports.updatePriceListPricesStep = (0, workflows_sdk_1.createStep)(exports.updatePriceListPricesStepId, async (stepInput, { container }) => {
    const { data = [], variant_price_map: variantPriceSetMap } = stepInput;
    const priceListPricesToUpdate = [];
    const priceIds = [];
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    for (const priceListData of data) {
        const pricesToUpdate = [];
        const { prices = [], id } = priceListData;
        for (const price of prices) {
            pricesToUpdate.push({
                ...price,
                price_set_id: variantPriceSetMap[price.variant_id],
            });
            if (price.id) {
                priceIds.push(price.id);
            }
        }
        priceListPricesToUpdate.push({
            price_list_id: id,
            prices: pricesToUpdate,
        });
    }
    const existingPrices = priceIds.length
        ? await pricingModule.listPrices({ id: priceIds }, { relations: ["price_list"] })
        : [];
    const priceListPricesMap = new Map();
    const dataBeforePriceUpdate = [];
    for (const price of existingPrices) {
        const priceListId = price.price_list.id;
        const prices = priceListPricesMap.get(priceListId) || [];
        priceListPricesMap.set(priceListId, prices);
    }
    for (const [priceListId, prices] of Object.entries(priceListPricesMap)) {
        dataBeforePriceUpdate.push({
            price_list_id: priceListId,
            prices: (0, utils_1.buildPriceSetPricesForModule)(prices),
        });
    }
    const updatedPrices = await pricingModule.updatePriceListPrices(priceListPricesToUpdate);
    return new workflows_sdk_1.StepResponse(updatedPrices, dataBeforePriceUpdate);
}, async (dataBeforePriceUpdate, { container }) => {
    if (!dataBeforePriceUpdate?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    if (dataBeforePriceUpdate.length) {
        await pricingModule.updatePriceListPrices(dataBeforePriceUpdate);
    }
});
