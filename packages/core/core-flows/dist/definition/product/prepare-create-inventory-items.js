"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCreateInventoryItems = void 0;
async function prepareCreateInventoryItems({ data, }) {
    const taggedVariants = data.products.reduce((acc, product) => {
        const cleanVariants = product.variants.reduce((acc, variant) => {
            if (!variant.manage_inventory) {
                return acc;
            }
            variant._associationTag = variant.id;
            acc.push(variant);
            return acc;
        }, []);
        return acc.concat(cleanVariants);
    }, []);
    return {
        alias: prepareCreateInventoryItems.aliases.output,
        value: {
            inventoryItems: taggedVariants,
        },
    };
}
exports.prepareCreateInventoryItems = prepareCreateInventoryItems;
prepareCreateInventoryItems.aliases = {
    products: "products",
    output: "prepareCreateInventoryItemsOutput",
};
