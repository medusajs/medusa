export interface AdminSalesChannelsDeleteRes {
    /**
     * The ID of the deleted sales channel
     */
    id: string;
    /**
     * The type of the object that was deleted.
     */
    object: string;
    /**
     * Whether or not the items were deleted.
     */
    deleted: boolean;
}
