"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConfirmInventoryInput = void 0;
const medusa_core_utils_1 = require("medusa-core-utils");
const prepareConfirmInventoryInput = ({ product_variant_inventory_items, location_ids, items, variants, }) => {
    if (!product_variant_inventory_items.length) {
        return [];
    }
    const variantsMap = new Map(variants.map((v) => [v.id, v]));
    const itemsToConfirm = [];
    items.forEach((item) => {
        const variant = variantsMap.get(item.variant_id);
        if (!variant?.manage_inventory) {
            return;
        }
        const variantInventoryItem = product_variant_inventory_items.find((i) => i.variant_id === item.variant_id);
        if (!variantInventoryItem) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `Variant ${item.variant_id} does not have any inventory items associated with it.`);
        }
        itemsToConfirm.push({
            inventory_item_id: variantInventoryItem.inventory_item_id,
            required_quantity: variantInventoryItem.required_quantity,
            quantity: item.quantity,
            location_ids: location_ids,
        });
    });
    return itemsToConfirm;
};
exports.prepareConfirmInventoryInput = prepareConfirmInventoryInput;
