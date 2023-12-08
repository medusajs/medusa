/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderSwapsReq {
  /**
   * The Line Items to associate with the swap's return.
   */
  return_items: Array<{
    /**
     * The ID of the Line Item that will be returned.
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
   * The shipping method associated with the swap's return.
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
     * The ID of the Product Variant.
     */
    variant_id: string
    /**
     * The quantity of the Product Variant.
     */
    quantity: number
  }>
  /**
   * The ID of the sales channel associated with the swap.
   */
  sales_channel_id?: string
  /**
   * An array of custom shipping options to potentially create a Shipping Method from to send the additional items.
   */
  custom_shipping_options?: Array<{
    /**
     * The ID of the Shipping Option.
     */
    option_id: string
    /**
     * The custom price of the Shipping Option.
     */
    price: number
  }>
  /**
   * If set to `true`, no notification will be sent to the customer related to this Swap.
   */
  no_notification?: boolean
  /**
   * The ID of the location used for the associated return.
   */
  return_location_id?: string
  /**
   * If set to `true`, swaps can be completed with items out of stock
   */
  allow_backorder?: boolean
}
