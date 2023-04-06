/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface StorePostCartsCartReq {
  /**
   * The id of the Region to create the Cart in.
   */
  region_id?: string
  /**
   * The 2 character ISO country code to create the Cart in.
   */
  country_code?: string
  /**
   * An email to be used on the Cart.
   */
  email?: string
  /**
   * The ID of the Sales channel to update the Cart with.
   */
  sales_channel_id?: string
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The Address to be used for shipping.
   */
  shipping_address?: AddressPayload | string
  /**
   * An array of Gift Card codes to add to the Cart.
   */
  gift_cards?: Array<{
    /**
     * The code that a Gift Card is identified by.
     */
    code: string
  }>
  /**
   * An array of Discount codes to add to the Cart.
   */
  discounts?: Array<{
    /**
     * The code that a Discount is identifed by.
     */
    code: string
  }>
  /**
   * The ID of the Customer to associate the Cart with.
   */
  customer_id?: string
  /**
   * An optional object to provide context to the Cart.
   */
  context?: Record<string, any>
}
