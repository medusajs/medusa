/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDraftOrdersDraftOrderLineItemsItemReq {
  /**
   * The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
   */
  unit_price?: number
  /**
   * The title of the line item if `variant_id` is not provided.
   */
  title?: string
  /**
   * The quantity of the line item.
   */
  quantity?: number
  /**
   * The optional key-value map with additional details about the Line Item.
   */
  metadata?: Record<string, any>
}
