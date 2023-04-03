/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostSwapsReq {
  /**
   * The ID of the Order to create the Swap for.
   */
  order_id: string
  /**
   * The items to include in the Return.
   */
  return_items: Array<{
    /**
     * The ID of the Line Item from the Order.
     */
    item_id: string
    /**
     * The quantity to swap.
     */
    quantity: number
    /**
     * The ID of the reason of this return.
     */
    reason_id?: string
    /**
     * The note to add to the item being swapped.
     */
    note?: string
  }>
  /**
   * The ID of the Shipping Option to create the Shipping Method from.
   */
  return_shipping_option?: string
  /**
   * The items to exchange the returned items to.
   */
  additional_items: Array<{
    /**
     * The ID of the Product Variant to send.
     */
    variant_id: string
    /**
     * The quantity to send of the variant.
     */
    quantity: number
  }>
}
