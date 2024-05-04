"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingOptionsPriceSetsStep = exports.createShippingOptionsPriceSetsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
function buildPriceSet(prices, regionToCurrencyMap) {
    const rules = [];
    const shippingOptionPrices = prices.map((price) => {
        if ("currency_code" in price) {
            return {
                currency_code: price.currency_code,
                amount: price.amount,
            };
        }
        rules.push({
            rule_attribute: "region_id",
        });
        return {
            currency_code: regionToCurrencyMap.get(price.region_id),
            amount: price.amount,
            rules: {
                region_id: price.region_id,
            },
        };
    });
    return { rules, prices: shippingOptionPrices };
}
exports.createShippingOptionsPriceSetsStepId = "add-shipping-options-prices-step";
exports.createShippingOptionsPriceSetsStep = (0, workflows_sdk_1.createStep)(exports.createShippingOptionsPriceSetsStepId, async (data, { container }) => {
    if (!data?.length) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const regionIds = data
        .map((input) => input.prices)
        .flat()
        .filter((price) => {
        return "region_id" in price;
    })
        .map((price) => price.region_id);
    let regionToCurrencyMap = new Map();
    if (regionIds.length) {
        const regionService = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
        const regions = await regionService.list({
            id: [...new Set(regionIds)],
        }, {
            select: ["id", "currency_code"],
        });
        regionToCurrencyMap = new Map(regions.map((region) => [region.id, region.currency_code]));
    }
    const priceSetsData = data.map((input) => buildPriceSet(input.prices, regionToCurrencyMap));
    const pricingService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const priceSets = await pricingService.create(priceSetsData);
    const shippingOptionPriceSetLinData = data.map((input, index) => {
        return {
            id: input.id,
            priceSetId: priceSets[index].id,
        };
    });
    return new workflows_sdk_1.StepResponse(shippingOptionPriceSetLinData, priceSets.map((priceSet) => priceSet.id));
}, async (priceSetIds, { container }) => {
    if (!priceSetIds?.length) {
        return;
    }
    const pricingService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingService.delete(priceSetIds);
});
