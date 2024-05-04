export interface AdminCustomerGroupsDeleteRes {
    /**
     * The ID of the deleted customer group.
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether the customer group was deleted successfully or not.
     */
    deleted: boolean;
}
