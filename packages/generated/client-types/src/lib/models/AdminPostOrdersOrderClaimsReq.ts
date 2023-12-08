/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

/**
 * The details of the claim to be created.
 */
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
     * A list of tags to add to the Claim Item
     */
    tags?: Array<string>
    /**
     * A list of image URL's that will be associated with the Claim
     */
    images?: any
  }>
  /**
   * Optional details for the Return Shipping Method, if the items are to be sent back. Providing this field will result in a return being created and associated with the claim.
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
   * The new items to send to the Customer. This is only used if the claim's type is `replace`.
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
   * The Shipping Methods to send the additional Line Items with. This is only used if the claim's type is `replace`.
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
   * An optional shipping address to send the claimed items to. If not provided, the parent order's shipping address will be used.
   */
  shipping_address?: AddressPayload
  /**
   * The amount to refund the customer. This is used when the claim's type is `refund`.
   */
  refund_amount?: number
  /**
   * If set to true no notification will be send related to this Claim.
   */
  no_notification?: boolean
  /**
   * The ID of the location used for the associated return.
   */
  return_location_id?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
