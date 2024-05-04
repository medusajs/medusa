"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsVariantsPrices = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
async function updateProductsVariantsPrices({ container, context, data, }) {
    const { manager } = context;
    const products = data.products;
    const productsHandleVariantsIndexPricesMap = data.productsHandleVariantsIndexPricesMap;
    const productVariantService = container.resolve("productVariantService");
    const regionService = container.resolve("regionService");
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const productVariantServiceTx = productVariantService.withTransaction(manager);
    const variantIdsPricesData = [];
    const variantPricesMap = new Map();
    const productsMap = new Map(products.map((p) => [p.handle, p]));
    const regionIds = new Set();
    for (const mapData of productsHandleVariantsIndexPricesMap.entries()) {
        const [handle, variantData] = mapData;
        const product = productsMap.get(handle);
        if (!product) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Product with handle ${handle} not found`);
        }
        variantData.forEach((item, index) => {
            const variant = product.variants[index];
            variantIdsPricesData.push({
                variantId: variant.id,
                prices: item.prices,
            });
            const prices = [];
            variantPricesMap.set(variant.id, prices);
            item.prices.forEach((price) => {
                const obj = {
                    amount: price.amount,
                    currency_code: price.currency_code,
                };
                if (price.region_id) {
                    regionIds.add(price.region_id);
                    obj.region_id = price.region_id;
                }
                prices.push(obj);
            });
        });
    }
    if (regionIds.size) {
        const regions = await regionService.list({
            id: [...regionIds],
        });
        const regionMap = new Map(regions.map((r) => [r.id, r]));
        for (const [, prices] of variantPricesMap.entries()) {
            prices.forEach((price) => {
                if (price.region_id) {
                    const region = regionMap.get(price.region_id);
                    price.currency_code = region?.currency_code;
                    price.rules = {
                        region_id: price.region_id,
                    };
                    delete price.region_id;
                }
            });
        }
    }
    if (featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key)) {
        const remoteLink = container.resolve("remoteLink");
        const pricingModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
        const priceSetsToCreate = variantIdsPricesData.map(({ variantId }) => ({
            rules: [{ rule_attribute: "region_id" }],
            prices: variantPricesMap.get(variantId),
        }));
        const priceSets = await pricingModuleService.create(priceSetsToCreate);
        const links = priceSets.map((priceSet, index) => ({
            productService: {
                variant_id: variantIdsPricesData[index].variantId,
            },
            pricingService: {
                price_set_id: priceSet.id,
            },
        }));
        await remoteLink.create(links);
    }
    else {
        await productVariantServiceTx.updateVariantPrices(variantIdsPricesData);
    }
}
exports.updateProductsVariantsPrices = updateProductsVariantsPrices;
updateProductsVariantsPrices.aliases = {
    products: "products",
};
