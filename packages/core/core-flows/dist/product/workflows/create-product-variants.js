"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariantsWorkflow = exports.createProductVariantsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const pricing_1 = require("../../pricing");
exports.createProductVariantsWorkflowId = "create-product-variants";
exports.createProductVariantsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createProductVariantsWorkflowId, (input) => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is created.
    const variantsWithoutPrices = (0, workflows_sdk_1.transform)({ input }, (data) => data.input.product_variants.map((v) => ({
        ...v,
        prices: undefined,
    })));
    const createdVariants = (0, steps_1.createProductVariantsStep)(variantsWithoutPrices);
    // Note: We rely on the same order of input and output when creating variants here, make sure that assumption holds
    const pricesToCreate = (0, workflows_sdk_1.transform)({ input, createdVariants }, (data) => data.createdVariants.map((v, i) => {
        return {
            prices: data.input.product_variants[i]?.prices,
        };
    }));
    // TODO: From here until the final transform the code is the same as when creating a product, we can probably refactor
    const createdPriceSets = (0, pricing_1.createPriceSetsStep)(pricesToCreate);
    const variantAndPriceSets = (0, workflows_sdk_1.transform)({ createdVariants, createdPriceSets }, (data) => {
        return data.createdVariants.map((variant, i) => ({
            variant: variant,
            price_set: data.createdPriceSets[i],
        }));
    });
    const variantAndPriceSetLinks = (0, workflows_sdk_1.transform)({ variantAndPriceSets }, (data) => {
        return {
            links: data.variantAndPriceSets.map((entry) => ({
                variant_id: entry.variant.id,
                price_set_id: entry.price_set.id,
            })),
        };
    });
    (0, steps_1.createVariantPricingLinkStep)(variantAndPriceSetLinks);
    return (0, workflows_sdk_1.transform)({
        variantAndPriceSets,
    }, (data) => {
        return data.variantAndPriceSets.map((variantAndPriceSet) => ({
            ...variantAndPriceSet.variant,
            ...variantAndPriceSet.price_set,
        }));
    });
});
