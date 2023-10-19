/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostReturnsReq {
  /**
   * The ID of the Order to create the return for.
   */
  order_id: string
  /**
   * The items to include in the return.
   */
  items: Array<{
    /**
     * The ID of the line item to return.
     */
    item_id: string
    /**
     * The quantity to return.
     */
    quantity: number
    /**
     * The ID of the return reason. Return reasons can be retrieved from the List Return Reasons API Route.
     */
    reason_id?: string
    /**
     * A note to add to the item returned.
     */
    note?: string
  }>
  /**
   * The return shipping method used to return the items. If provided, a fulfillment is automatically created for the return.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id: string
  }
}
