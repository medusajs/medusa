"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExistingPriceListsPriceIdsStep = exports.getExistingPriceListsPriceIdsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getExistingPriceListsPriceIdsStepId = "get-existing-price-lists-prices";
exports.getExistingPriceListsPriceIdsStep = (0, workflows_sdk_1.createStep)(exports.getExistingPriceListsPriceIdsStepId, async (data, { container }) => {
    const { price_list_ids: priceListIds = [] } = data;
    const priceListPriceIdsMap = {};
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const existingPrices = priceListIds.length
        ? await pricingModule.listPrices({ price_list_id: priceListIds }, { relations: ["price_list"], take: null })
        : [];
    for (const price of existingPrices) {
        const priceListId = price.price_list.id;
        const prices = priceListPriceIdsMap[priceListId] || [];
        priceListPriceIdsMap[priceListId] = prices.concat(price.id);
    }
    return new workflows_sdk_1.StepResponse(priceListPriceIdsMap);
});
