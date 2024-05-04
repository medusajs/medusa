"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShippingOptionsPricesStep = exports.setShippingOptionsPricesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function getCurrentShippingOptionPrices(shippingOptionIds, { remoteQuery }) {
    const query = (0, utils_1.remoteQueryObjectFromString)({
        service: utils_1.LINKS.ShippingOptionPriceSet,
        variables: {
            filters: { shipping_option_id: shippingOptionIds },
            take: null,
        },
        fields: ["shipping_option_id", "price_set_id", "price_set.prices.*"],
    });
    const shippingOptionPrices = (await remoteQuery(query));
    return shippingOptionPrices.map((shippingOption) => {
        const prices = shippingOption.price_set?.prices ?? [];
        const price_set_id = shippingOption.price_set_id;
        return {
            shipping_option_id: shippingOption.shipping_option_id,
            price_set_id,
            prices,
        };
    });
}
function buildPrices(prices, regionToCurrencyMap) {
    if (!prices) {
        return [];
    }
    const shippingOptionPrices = prices.map((price) => {
        if ("region_id" in price) {
            const currency_code = regionToCurrencyMap.get(price.region_id);
            const regionId = price.region_id;
            delete price.region_id;
            return {
                ...price,
                currency_code: currency_code,
                amount: price.amount,
                rules: {
                    region_id: regionId,
                },
            };
        }
        return price;
    });
    return shippingOptionPrices;
}
exports.setShippingOptionsPricesStepId = "set-shipping-options-prices-step";
exports.setShippingOptionsPricesStep = (0, workflows_sdk_1.createStep)(exports.setShippingOptionsPricesStepId, async (data, { container }) => {
    if (!data.length) {
        return;
    }
    const regionIds = data
        .map((input) => input.prices)
        .flat()
        .filter((price) => "region_id" in (price ?? {}))
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
    const remoteQuery = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const currentShippingOptionPricesData = await getCurrentShippingOptionPrices(data.map((d) => d.id), { remoteQuery });
    const shippingOptionPricesMap = new Map(currentShippingOptionPricesData.map((currentShippingOptionDataItem) => {
        const shippingOptionData = data.find((d) => d.id === currentShippingOptionDataItem.shipping_option_id);
        const pricesData = shippingOptionData?.prices?.map((priceData) => {
            return {
                ...priceData,
                price_set_id: currentShippingOptionDataItem.price_set_id,
            };
        });
        const buildPricesData = pricesData && buildPrices(pricesData, regionToCurrencyMap);
        return [
            currentShippingOptionDataItem.shipping_option_id,
            {
                price_set_id: currentShippingOptionDataItem.price_set_id,
                prices: buildPricesData,
            },
        ];
    }));
    const pricingService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    for (const data_ of data) {
        const shippingOptionData = shippingOptionPricesMap.get(data_.id);
        if (!(0, utils_1.isDefined)(shippingOptionData.prices)) {
            continue;
        }
        await pricingService.update(shippingOptionData.price_set_id, {
            prices: shippingOptionData.prices,
        });
    }
    return new workflows_sdk_1.StepResponse(void 0, currentShippingOptionPricesData);
}, async (rollbackData, { container }) => {
    if (!rollbackData?.length) {
        return;
    }
    const pricingService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    for (const data_ of rollbackData) {
        const prices = data_.prices;
        if (!(0, utils_1.isDefined)(prices)) {
            continue;
        }
        await pricingService.update(data_.price_set_id, { prices });
    }
});
