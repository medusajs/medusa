/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostReturnsReq {
  /**
   * The ID of the Order to create the Return from.
   */
  order_id: string
  /**
   * The items to include in the Return.
   */
  items: Array<{
    /**
     * The ID of the Line Item from the Order.
     */
    item_id: string
    /**
     * The quantity to return.
     */
    quantity: number
    /**
     * The ID of the return reason.
     */
    reason_id?: string
    /**
     * A note to add to the item returned.
     */
    note?: string
  }>
  /**
   * If the Return is to be handled by the store operator the Customer can choose a Return Shipping Method. Alternatvely the Customer can handle the Return themselves.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id: string
  }
}
