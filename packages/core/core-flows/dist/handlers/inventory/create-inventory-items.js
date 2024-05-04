"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryItems = void 0;
const utils_1 = require("@medusajs/utils");
async function createInventoryItems({ container, data, }) {
    const inventoryService = container.resolve("inventoryService");
    if (!inventoryService) {
        const logger = container.resolve("logger");
        logger.warn(`Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'createInventoryItems' will be skipped.`);
        return void 0;
    }
    return await (0, utils_1.promiseAll)(data.inventoryItems.map(async (item) => {
        const inventoryItem = await inventoryService.createInventoryItem({
            sku: item.sku,
            origin_country: item.origin_country,
            hs_code: item.hs_code,
            mid_code: item.mid_code,
            material: item.material,
            weight: item.weight,
            length: item.length,
            height: item.height,
            width: item.width,
        });
        return { tag: item._associationTag ?? inventoryItem.id, inventoryItem };
    }));
}
exports.createInventoryItems = createInventoryItems;
createInventoryItems.aliases = {
    payload: "payload",
};
