export interface AdminProductCategoriesCategoryDeleteRes {
    /**
     * The ID of the deleted product category
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
