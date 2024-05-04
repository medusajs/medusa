"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePriceListPricesStep = exports.removePriceListPricesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.removePriceListPricesStepId = "remove-price-list-prices";
exports.removePriceListPricesStep = (0, workflows_sdk_1.createStep)(exports.removePriceListPricesStepId, async (ids, { container }) => {
    if (!ids.length) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const prices = await pricingModule.listPrices({ id: ids }, { relations: ["price_list"] });
    const priceIds = prices.map((price) => price.id);
    await pricingModule.softDeletePrices(priceIds);
    return new workflows_sdk_1.StepResponse(priceIds, priceIds);
}, async (ids, { container }) => {
    if (!ids?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.restorePrices(ids);
});
