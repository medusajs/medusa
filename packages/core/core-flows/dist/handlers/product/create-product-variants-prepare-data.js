"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariantsPrepareData = void 0;
async function createProductVariantsPrepareData({ container, data, }) {
    const productVariants = data.productVariants || [];
    const variantIndexPricesMap = new Map();
    const productVariantsMap = new Map();
    for (const [index, productVariantData] of productVariants.entries()) {
        if (!productVariantData.product_id) {
            continue;
        }
        variantIndexPricesMap.set(index, productVariantData.prices || []);
        delete productVariantData.prices;
        const productVariants = productVariantsMap.get(productVariantData.product_id);
        if (productVariants) {
            productVariants.push(productVariantData);
        }
        else {
            productVariantsMap.set(productVariantData.product_id, [
                productVariantData,
            ]);
        }
    }
    return {
        productVariants,
        variantIndexPricesMap,
        productVariantsMap,
    };
}
exports.createProductVariantsPrepareData = createProductVariantsPrepareData;
createProductVariantsPrepareData.aliases = {
    payload: "payload",
};
