"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductsWorkflow = exports.createProductsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_products_1 = require("../steps/create-products");
const create_variant_pricing_link_1 = require("../steps/create-variant-pricing-link");
const pricing_1 = require("../../pricing");
const sales_channel_1 = require("../../sales-channel");
exports.createProductsWorkflowId = "create-products";
exports.createProductsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createProductsWorkflowId, (input) => {
    // Passing prices to the product module will fail, we want to keep them for after the product is created.
    const productWithoutExternalRelations = (0, workflows_sdk_1.transform)({ input }, (data) => data.input.products.map((p) => ({
        ...p,
        sales_channels: undefined,
        variants: p.variants?.map((v) => ({
            ...v,
            prices: undefined,
        })),
    })));
    const createdProducts = (0, create_products_1.createProductsStep)(productWithoutExternalRelations);
    const salesChannelLinks = (0, workflows_sdk_1.transform)({ input, createdProducts }, (data) => {
        return data.createdProducts
            .map((createdProduct, i) => {
            const inputProduct = data.input.products[i];
            return (inputProduct.sales_channels?.map((salesChannel) => ({
                sales_channel_id: salesChannel.id,
                product_id: createdProduct.id,
            })) ?? []);
        })
            .flat();
    });
    (0, sales_channel_1.associateProductsWithSalesChannelsStep)({ links: salesChannelLinks });
    // Note: We rely on the same order of input and output when creating products here, ensure this always holds true
    const variantsWithAssociatedPrices = (0, workflows_sdk_1.transform)({ input, createdProducts }, (data) => {
        return data.createdProducts
            .map((p, i) => {
            const inputProduct = data.input.products[i];
            return p.variants?.map((v, j) => ({
                ...v,
                prices: inputProduct?.variants?.[j]?.prices ?? [],
            }));
        })
            .flat();
    });
    const pricesToCreate = (0, workflows_sdk_1.transform)({ variantsWithAssociatedPrices }, (data) => data.variantsWithAssociatedPrices.map((v) => ({
        prices: v.prices ?? [],
    })));
    const createdPriceSets = (0, pricing_1.createPriceSetsStep)(pricesToCreate);
    const variantAndPriceSets = (0, workflows_sdk_1.transform)({ variantsWithAssociatedPrices, createdPriceSets }, (data) => data.variantsWithAssociatedPrices.map((variant, i) => ({
        variant: variant,
        price_set: data.createdPriceSets[i],
    })));
    const variantAndPriceSetLinks = (0, workflows_sdk_1.transform)({ variantAndPriceSets }, (data) => {
        return {
            links: data.variantAndPriceSets.map((entry) => ({
                variant_id: entry.variant.id,
                price_set_id: entry.price_set.id,
            })),
        };
    });
    (0, create_variant_pricing_link_1.createVariantPricingLinkStep)(variantAndPriceSetLinks);
    return createdProducts;
});
