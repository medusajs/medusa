/**
 * The details of the line item to create.
 */
export interface StorePostCartsCartLineItemsReq {
    /**
     * The id of the Product Variant to generate the Line Item from.
     */
    variant_id: string;
    /**
     * The quantity of the Product Variant to add to the Line Item.
     */
    quantity: number;
    /**
     * An optional key-value map with additional details about the Line Item.
     */
    metadata?: Record<string, any>;
}
