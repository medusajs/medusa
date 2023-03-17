/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderSwapsReq {
  /**
   * The Line Items to return as part of the Swap.
   */
  return_items: Array<{
    /**
     * The ID of the Line Item that will be claimed.
     */
    item_id: string
    /**
     * The number of items that will be returned
     */
    quantity: number
    /**
     * The ID of the Return Reason to use.
     */
    reason_id?: string
    /**
     * An optional note with information about the Return.
     */
    note?: string
  }>
  /**
   * How the Swap will be returned.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id: string
    /**
     * The price to charge for the Shipping Method.
     */
    price?: number
  }
  /**
   * The new items to send to the Customer.
   */
  additional_items?: Array<{
    /**
     * The ID of the Product Variant to ship.
     */
    variant_id: string
    /**
     * The quantity of the Product Variant to ship.
     */
    quantity: number
  }>
  /**
   * The custom shipping options to potentially create a Shipping Method from.
   */
  custom_shipping_options?: Array<{
    /**
     * The ID of the Shipping Option to override with a custom price.
     */
    option_id: string
    /**
     * The custom price of the Shipping Option.
     */
    price: number
  }>
  /**
   * If set to true no notification will be send related to this Swap.
   */
  no_notification?: boolean
  /**
   * If true, swaps can be completed with items out of stock
   */
  allow_backorder?: boolean
}
