"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductsPrepareCreatePricesCompensation = void 0;
async function createProductsPrepareCreatePricesCompensation({ data, }) {
    const productsHandleVariantsIndexPricesMap = data.preparedData.productsHandleVariantsIndexPricesMap;
    const products = data.products;
    const updatedProductsHandleVariantsIndexPricesMap = new Map();
    productsHandleVariantsIndexPricesMap.forEach((existingItems, productHandle) => {
        const items = updatedProductsHandleVariantsIndexPricesMap.get(productHandle) ?? [];
        existingItems.forEach(({ index }) => {
            items.push({
                index,
                prices: [],
            });
        });
        updatedProductsHandleVariantsIndexPricesMap.set(productHandle, items);
    });
    return {
        alias: createProductsPrepareCreatePricesCompensation.aliases.output,
        value: {
            productsHandleVariantsIndexPricesMap: updatedProductsHandleVariantsIndexPricesMap,
            products,
        },
    };
}
exports.createProductsPrepareCreatePricesCompensation = createProductsPrepareCreatePricesCompensation;
createProductsPrepareCreatePricesCompensation.aliases = {
    preparedData: "preparedData",
    output: "createProductsPrepareCreatePricesCompensationOutput",
};
