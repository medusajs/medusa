/**
 * The details of deleting a product.
 */
export interface AdminProductsDeleteRes {
    /**
     * The ID of the deleted Product.
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
