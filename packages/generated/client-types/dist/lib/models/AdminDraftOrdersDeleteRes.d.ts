export interface AdminDraftOrdersDeleteRes {
    /**
     * The ID of the deleted Draft Order.
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether the draft order was deleted successfully.
     */
    deleted: boolean;
}
