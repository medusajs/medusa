"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInventoryItems = void 0;
async function removeInventoryItems({ container, data, }) {
    const inventoryService = container.resolve("inventoryService");
    if (!inventoryService) {
        const logger = container.resolve("logger");
        logger.warn(`Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`);
        return [];
    }
    await inventoryService.deleteInventoryItem(data.inventoryItems.map(({ inventoryItem }) => inventoryItem.id));
    return data.inventoryItems;
}
exports.removeInventoryItems = removeInventoryItems;
removeInventoryItems.aliases = {
    inventoryItems: "inventoryItems",
};
