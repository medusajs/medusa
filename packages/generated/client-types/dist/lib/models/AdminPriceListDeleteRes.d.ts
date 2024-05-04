export interface AdminPriceListDeleteRes {
    /**
     * The ID of the deleted Price List.
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
