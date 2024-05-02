/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the fulfillment to be created.
 */
export interface AdminPostOrdersOrderFulfillmentsReq {
  /**
   * The Line Items to include in the Fulfillment.
   */
  items: Array<{
    /**
     * The ID of the Line Item to fulfill.
     */
    item_id: string
    /**
     * The quantity of the Line Item to fulfill.
     */
    quantity: number
  }>
  /**
   * The ID of the location where the items will be fulfilled from.
   */
  location_id?: string
  /**
   * If set to `true`, no notification will be sent to the customer related to this fulfillment.
   */
  no_notification?: boolean
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
