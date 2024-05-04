export interface AdminSalesChannelsDeleteLocationRes {
    /**
     * The ID of the removed stock location from a sales channel
     */
    id: string;
    /**
     * The type of the object that was removed.
     */
    object: string;
    /**
     * Whether or not the items were deleted.
     */
    deleted: boolean;
}
