"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachInventoryItems = void 0;
const utils_1 = require("@medusajs/utils");
async function detachInventoryItems({ container, context, data, }) {
    const { manager } = context;
    const productVariantInventoryService = container
        .resolve("productVariantInventoryService")
        .withTransaction(manager);
    if (!data?.inventoryItems?.length) {
        return [];
    }
    await (0, utils_1.promiseAll)(data.inventoryItems.map(async ({ tag, inventoryItem }) => {
        return await productVariantInventoryService.detachInventoryItem(inventoryItem.id, tag);
    }));
    return data.inventoryItems;
}
exports.detachInventoryItems = detachInventoryItems;
detachInventoryItems.aliases = {
    inventoryItems: "inventoryItems",
};
