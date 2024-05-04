export interface AdminPostInventoryItemsItemLocationLevelsLevelReq {
    /**
     * the total stock quantity of an inventory item at the given location ID
     */
    stocked_quantity?: number;
    /**
     * the incoming stock quantity of an inventory item at the given location ID
     */
    incoming_quantity?: number;
}
