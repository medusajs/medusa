/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderClaimsClaimReq {
  /**
   * The Claim Items that the Claim will consist of.
   */
  claim_items?: Array<{
    /**
     * The ID of the Claim Item.
     */
    id: string
    /**
     * The ID of the Line Item that will be claimed.
     */
    item_id?: string
    /**
     * The number of items that will be returned
     */
    quantity?: number
    /**
     * Short text describing the Claim Item in further detail.
     */
    note?: string
    /**
     * The reason for the Claim
     */
    reason?: "missing_item" | "wrong_item" | "production_failure" | "other"
    /**
     * A list o tags to add to the Claim Item
     */
    tags: Array<{
      /**
       * Tag ID
       */
      id?: string
      /**
       * Tag value
       */
      value?: string
    }>
    /**
     * A list of image URL's that will be associated with the Claim
     */
    images: Array<{
      /**
       * Image ID
       */
      id?: string
      /**
       * Image URL
       */
      url?: string
    }>
    /**
     * An optional set of key-value pairs to hold additional information.
     */
    metadata?: Record<string, any>
  }>
  /**
   * The Shipping Methods to send the additional Line Items with.
   */
  shipping_methods?: Array<{
    /**
     * The ID of an existing Shipping Method
     */
    id?: string
    /**
     * The ID of the Shipping Option to create a Shipping Method from
     */
    option_id?: string
    /**
     * The price to charge for the Shipping Method
     */
    price?: number
    /**
     * An optional set of key-value pairs to hold additional information.
     */
    data?: Record<string, any>
  }>
  /**
   * If set to true no notification will be send related to this Swap.
   */
  no_notification?: boolean
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
