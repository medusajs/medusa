"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsExtractCreatedVariants = void 0;
async function updateProductsExtractCreatedVariants({ data, }) {
    const createdVariants = [];
    data.products.forEach((product) => {
        const addedVariants = [];
        const originalProduct = data.preparedData.originalProducts.find((p) => p.id === product.id);
        product.variants.forEach((variant) => {
            if (!originalProduct.variants.find((v) => v.id === variant.id)) {
                addedVariants.push(variant);
            }
        });
        createdVariants.push(...addedVariants);
    });
    return {
        alias: updateProductsExtractCreatedVariants.aliases.output,
        value: [{ variants: createdVariants }],
    };
}
exports.updateProductsExtractCreatedVariants = updateProductsExtractCreatedVariants;
updateProductsExtractCreatedVariants.aliases = {
    preparedData: "preparedData",
    products: "products",
    output: "products",
};
