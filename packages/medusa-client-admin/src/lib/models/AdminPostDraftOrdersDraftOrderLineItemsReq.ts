/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostDraftOrdersDraftOrderLineItemsReq = {
  /**
   * The ID of the Product Variant to generate the Line Item from.
   */
  variant_id?: string;
  /**
   * The potential custom price of the item.
   */
  unit_price?: number;
  /**
   * The potential custom title of the item.
   */
  title?: string;
  /**
   * The quantity of the Line Item.
   */
  quantity: number;
  /**
   * The optional key-value map with additional details about the Line Item.
   */
  metadata?: Record<string, any>;
};

