"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachInventoryItems = void 0;
async function attachInventoryItems({ container, context, data, }) {
    const { manager } = context;
    const productVariantInventoryService = container
        .resolve("productVariantInventoryService")
        .withTransaction(manager);
    if (!data?.inventoryItems?.length) {
        return [];
    }
    const inventoryData = data.inventoryItems.map(({ tag, inventoryItem }) => ({
        variantId: tag,
        inventoryItemId: inventoryItem.id,
    }));
    await productVariantInventoryService.attachInventoryItem(inventoryData);
    return data.inventoryItems;
}
exports.attachInventoryItems = attachInventoryItems;
attachInventoryItems.aliases = {
    inventoryItems: "inventoryItems",
};
