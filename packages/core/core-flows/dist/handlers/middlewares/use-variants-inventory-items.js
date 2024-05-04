"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVariantsInventoryItems = void 0;
async function useVariantsInventoryItems({ data, container, }) {
    const inventoryService = container.resolve("inventoryService");
    if (!inventoryService) {
        const logger = container.resolve("logger");
        logger.warn(`Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'useVariantsInventoryItems' will be skipped.`);
        return {
            alias: useVariantsInventoryItems.aliases.output,
            value: null,
        };
    }
    const [inventoryItems] = await inventoryService.listInventoryItems({
        sku: data.updateProductsExtractDeletedVariantsOutput.variants.map((v) => v.id),
    });
    const variantItems = inventoryItems.map((item) => ({
        inventoryItem: item,
        tag: data.updateProductsExtractDeletedVariantsOutput.variants.find((variant) => variant.sku === item.sku).id,
    }));
    return {
        alias: useVariantsInventoryItems.aliases.output,
        value: { inventoryItems: variantItems },
    };
}
exports.useVariantsInventoryItems = useVariantsInventoryItems;
useVariantsInventoryItems.aliases = {
    variants: "variants",
    output: "useVariantsInventoryItemsOutput",
};
