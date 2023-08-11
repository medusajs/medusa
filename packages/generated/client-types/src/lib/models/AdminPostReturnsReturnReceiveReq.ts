/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostReturnsReturnReceiveReq {
  /**
   * The Line Items that have been received.
   */
  items: Array<{
    /**
     * The ID of the Line Item.
     */
    item_id: string
    /**
     * The quantity of the Line Item.
     */
    quantity: number
  }>
  /**
   * The amount to refund.
   */
  refund?: number
}
