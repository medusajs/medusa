"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreInventoryItems = void 0;
async function restoreInventoryItems({ container, context, data, }) {
    const { manager } = context;
    const inventoryService = container.resolve("inventoryService");
    if (!inventoryService) {
        const logger = container.resolve("logger");
        logger.warn(`Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`);
        return;
    }
    return await inventoryService.restoreInventoryItem(data.inventoryItems.map(({ inventoryItem }) => inventoryItem.id), { transactionManager: manager });
}
exports.restoreInventoryItems = restoreInventoryItems;
restoreInventoryItems.aliases = {
    inventoryItems: "inventoryItems",
};
