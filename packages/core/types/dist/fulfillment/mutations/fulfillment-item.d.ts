/**
 * The fulfillment item to be created.
 */
export interface CreateFulfillmentItemDTO {
    /**
     * The associated fulfillment's ID.
     */
    fulfillment_id: string;
    /**
     * The title of the fulfillment item.
     */
    title: string;
    /**
     * The SKU of the fulfillment item.
     */
    sku: string;
    /**
     * The quantity of the fulfillment item.
     */
    quantity: number;
    /**
     * The barcode of the fulfillment item.
     */
    barcode: string;
    /**
     * The associated line item's ID.
     */
    line_item_id?: string | null;
    /**
     * The associated inventory item's ID.
     */
    inventory_item_id?: string | null;
}
//# sourceMappingURL=fulfillment-item.d.ts.map