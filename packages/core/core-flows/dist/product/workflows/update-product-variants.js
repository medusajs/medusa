"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariantsWorkflow = exports.updateProductVariantsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const pricing_1 = require("../../pricing");
const get_variant_pricing_link_1 = require("../steps/get-variant-pricing-link");
exports.updateProductVariantsWorkflowId = "update-product-variants";
exports.updateProductVariantsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateProductVariantsWorkflowId, (input) => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is updated.
    const updateWithoutPrices = (0, workflows_sdk_1.transform)({ input }, (data) => {
        if ("product_variants" in data.input) {
            return {
                product_variants: data.input.product_variants.map((variant) => {
                    return {
                        ...variant,
                        prices: undefined,
                    };
                }),
            };
        }
        return {
            selector: data.input.selector,
            update: {
                ...data.input.update,
                prices: undefined,
            },
        };
    });
    const updatedVariants = (0, steps_1.updateProductVariantsStep)(updateWithoutPrices);
    // We don't want to do any pricing updates if the prices didn't change
    const variantIds = (0, workflows_sdk_1.transform)({ input, updatedVariants }, (data) => {
        if ("product_variants" in data.input) {
            return data.updatedVariants.map((v) => v.id);
        }
        if (!data.input.update.prices) {
            return [];
        }
        return data.updatedVariants.map((v) => v.id);
    });
    const variantPriceSetLinks = (0, get_variant_pricing_link_1.getVariantPricingLinkStep)({
        ids: variantIds,
    });
    const pricesToUpdate = (0, workflows_sdk_1.transform)({ input, variantPriceSetLinks }, (data) => {
        if (!data.variantPriceSetLinks.length) {
            return {};
        }
        if ("product_variants" in data.input) {
            return data.variantPriceSetLinks.map((link) => {
                const variant = data.input.product_variants.find((v) => v.id === link.variant_id);
                return {
                    id: link.price_set_id,
                    prices: variant.prices,
                };
            });
        }
        return {
            selector: {
                id: data.variantPriceSetLinks.map((link) => link.price_set_id),
            },
            update: {
                prices: data.input.update.prices,
            },
        };
    });
    const updatedPriceSets = (0, pricing_1.updatePriceSetsStep)(pricesToUpdate);
    // We want to correctly return the variants with their associated price sets and the prices coming from it
    return (0, workflows_sdk_1.transform)({
        variantPriceSetLinks,
        updatedVariants,
        updatedPriceSets,
    }, (data) => {
        return data.updatedVariants.map((variant, i) => {
            const linkForVariant = data.variantPriceSetLinks?.find((link) => link.variant_id === variant.id);
            const priceSetForVariant = data.updatedPriceSets?.find((priceSet) => priceSet.id === linkForVariant?.price_set_id);
            return { ...variant, price_set: priceSetForVariant };
        });
    });
});
