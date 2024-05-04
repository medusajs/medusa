export interface AdminInventoryItemsDeleteRes {
    /**
     * The ID of the deleted Inventory Item.
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether or not the Inventory Item was deleted.
     */
    deleted: boolean;
}
