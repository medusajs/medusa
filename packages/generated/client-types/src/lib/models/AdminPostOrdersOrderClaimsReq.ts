/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface AdminPostOrdersOrderClaimsReq {
  /**
   * The type of the Claim. This will determine how the Claim is treated: `replace` Claims will result in a Fulfillment with new items being created, while a `refund` Claim will refund the amount paid for the claimed items.
   */
  type: "replace" | "refund"
  /**
   * The Claim Items that the Claim will consist of.
   */
  claim_items: Array<{
    /**
     * The ID of the Line Item that will be claimed.
     */
    item_id: string
    /**
     * The number of items that will be returned
     */
    quantity: number
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
    tags?: Array<string>
    /**
     * A list of image URL's that will be associated with the Claim
     */
    images?: any
  }>
  /**
   * Optional details for the Return Shipping Method, if the items are to be sent back.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id?: string
    /**
     * The price to charge for the Shipping Method.
     */
    price?: number
  }
  /**
   * The new items to send to the Customer when the Claim type is Replace.
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
   * An optional shipping address to send the claim to. Defaults to the parent order's shipping address
   */
  shipping_address?: AddressPayload
  /**
   * The amount to refund the Customer when the Claim type is `refund`.
   */
  refund_amount?: number
  /**
   * If set to true no notification will be send related to this Claim.
   */
  no_notification?: boolean
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
