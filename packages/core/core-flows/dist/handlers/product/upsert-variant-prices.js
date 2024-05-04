"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertVariantPrices = void 0;
const utils_1 = require("@medusajs/utils");
async function upsertVariantPrices({ container, data, }) {
    const { variantPricesMap } = data;
    const featureFlagRouter = container.resolve("featureFlagRouter");
    if (!featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key)) {
        return {
            createdLinks: [],
            originalMoneyAmounts: [],
            createdPriceSets: [],
        };
    }
    const pricingModuleService = container.resolve("pricingModuleService");
    const regionService = container.resolve("regionService");
    const remoteLink = container.resolve("remoteLink");
    const remoteQuery = container.resolve("remoteQuery");
    const variables = {
        variant_id: [...variantPricesMap.keys()],
    };
    const query = {
        product_variant_price_set: {
            __args: variables,
            fields: ["variant_id", "price_set_id"],
        },
    };
    const variantPriceSets = await remoteQuery(query);
    const variantIdToPriceSetIdMap = new Map(variantPriceSets.map((variantPriceSet) => [
        variantPriceSet.variant_id,
        variantPriceSet.price_set_id,
    ]));
    const moneyAmountsToUpdate = [];
    const createdPriceSets = [];
    const ruleSetPricesToAdd = [];
    const linksToCreate = [];
    for (const [variantId, prices = []] of variantPricesMap) {
        const priceSetToCreate = {
            rules: [{ rule_attribute: "region_id" }],
            prices: [],
        };
        const regionIds = prices.map((price) => price.region_id);
        const regions = await regionService.list({ id: regionIds });
        const regionsMap = new Map(regions.map((region) => [region.id, region]));
        for (const price of prices) {
            const region = price.region_id && regionsMap.get(price.region_id);
            let region_currency_code;
            let region_rules;
            if (region) {
                region_currency_code = region.currency_code;
                region_rules = {
                    region_id: region.id,
                };
            }
            if (price.id) {
                const priceToUpdate = {
                    id: price.id,
                    min_quantity: price.min_quantity,
                    max_quantity: price.max_quantity,
                    amount: price.amount,
                    currency_code: (region_currency_code ?? price.currency_code).toLowerCase(),
                };
                moneyAmountsToUpdate.push(priceToUpdate);
            }
            else {
                const variantPrice = {
                    min_quantity: price.min_quantity,
                    max_quantity: price.max_quantity,
                    amount: price.amount,
                    currency_code: (region_currency_code ?? price.currency_code).toLowerCase(),
                    rules: region_rules ?? {},
                };
                delete price.region_id;
                if (variantIdToPriceSetIdMap.get(variantId)) {
                    ruleSetPricesToAdd.push(variantPrice);
                }
                else {
                    priceSetToCreate.prices?.push(variantPrice);
                }
            }
        }
        let priceSetId = variantIdToPriceSetIdMap.get(variantId);
        if (priceSetId) {
            await pricingModuleService.addPrices({
                priceSetId,
                prices: ruleSetPricesToAdd,
            });
        }
        else {
            const createdPriceSet = await pricingModuleService.create(priceSetToCreate);
            priceSetId = createdPriceSet?.id;
            createdPriceSets.push(createdPriceSet);
            linksToCreate.push({
                productService: {
                    variant_id: variantId,
                },
                pricingService: {
                    price_set_id: priceSetId,
                },
            });
        }
    }
    const createdLinks = await remoteLink.create(linksToCreate);
    let originalMoneyAmounts = await pricingModuleService.listMoneyAmounts({
        id: moneyAmountsToUpdate.map((matu) => matu.id),
    }, {
        select: ["id", "currency_code", "amount", "min_quantity", "max_quantity"],
        take: null,
    });
    if (moneyAmountsToUpdate.length) {
        await pricingModuleService.updateMoneyAmounts(moneyAmountsToUpdate);
    }
    return {
        createdLinks,
        originalMoneyAmounts,
        createdPriceSets,
    };
}
exports.upsertVariantPrices = upsertVariantPrices;
upsertVariantPrices.aliases = {
    productVariantsPrices: "productVariantsPrices",
};
