import type { InventoryItemDTO } from "./InventoryItemDTO";
/**
 * The inventory item's details.
 */
export interface AdminInventoryItemsRes {
    /**
     * Inventory Item details
     */
    inventory_item: InventoryItemDTO;
}
