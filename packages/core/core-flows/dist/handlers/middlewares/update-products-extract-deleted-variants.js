"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsExtractDeletedVariants = void 0;
async function updateProductsExtractDeletedVariants({ data, container, }) {
    const deletedVariants = [];
    data.products.forEach((product) => {
        const removedVariants = [];
        const originalProduct = data.preparedData.originalProducts.find((p) => p.id === product.id);
        originalProduct.variants.forEach((variant) => {
            if (!product.variants.find((v) => v.id === variant.id)) {
                removedVariants.push(variant);
            }
        });
        deletedVariants.push(...removedVariants);
    });
    return {
        alias: updateProductsExtractDeletedVariants.aliases.output,
        value: {
            variants: deletedVariants,
        },
    };
}
exports.updateProductsExtractDeletedVariants = updateProductsExtractDeletedVariants;
updateProductsExtractDeletedVariants.aliases = {
    preparedData: "preparedData",
    products: "products",
    output: "updateProductsExtractDeletedVariantsOutput",
};
