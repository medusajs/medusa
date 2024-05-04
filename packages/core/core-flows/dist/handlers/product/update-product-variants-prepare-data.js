"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariantsPrepareData = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
async function updateProductVariantsPrepareData({ container, context, data, }) {
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key);
    let productVariants = data.productVariants || [];
    const variantsDataMap = new Map(productVariants.map((productVariantData) => [
        productVariantData.id,
        productVariantData,
    ]));
    const variantIds = productVariants.map((pv) => pv.id);
    const productVariantsMap = new Map();
    const variantPricesMap = new Map();
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    const variantsWithProductIds = await productModuleService.listVariants({
        id: variantIds,
    }, {
        select: ["id", "product_id"],
        take: null,
    });
    for (const variantWithProductID of variantsWithProductIds) {
        const variantData = variantsDataMap.get(variantWithProductID.id);
        if (!variantData) {
            continue;
        }
        variantPricesMap.set(variantWithProductID.id, variantData.prices || []);
        if (isPricingDomainEnabled) {
            delete variantData.prices;
        }
        const variantsData = productVariantsMap.get(variantWithProductID.product_id) || [];
        if (variantData) {
            variantsData.push(variantData);
        }
        productVariantsMap.set(variantWithProductID.product_id, variantsData);
    }
    return {
        productVariants,
        variantPricesMap,
        productVariantsMap,
    };
}
exports.updateProductVariantsPrepareData = updateProductVariantsPrepareData;
updateProductVariantsPrepareData.aliases = {
    payload: "payload",
};
