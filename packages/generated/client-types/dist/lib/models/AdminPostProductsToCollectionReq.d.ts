/**
 * The details of the products to add to the collection.
 */
export interface AdminPostProductsToCollectionReq {
    /**
     * An array of Product IDs to add to the Product Collection.
     */
    product_ids: Array<string>;
}
