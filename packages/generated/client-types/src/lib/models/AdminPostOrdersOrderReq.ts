/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"
import type { Discount } from "./Discount"
import type { LineItem } from "./LineItem"

export interface AdminPostOrdersOrderReq {
  /**
   * the email for the order
   */
  email?: string
  /**
   * Billing address
   */
  billing_address?: AddressPayload
  /**
   * Shipping address
   */
  shipping_address?: AddressPayload
  /**
   * The Line Items for the order
   */
  items?: Array<LineItem>
  /**
   * ID of the region where the order belongs
   */
  region?: string
  /**
   * Discounts applied to the order
   */
  discounts?: Array<Discount>
  /**
   * ID of the customer
   */
  customer_id?: string
  /**
   * payment method chosen for the order
   */
  payment_method?: {
    /**
     * ID of the payment provider
     */
    provider_id?: string
    /**
     * Data relevant for the given payment method
     */
    data?: Record<string, any>
  }
  /**
   * The Shipping Method used for shipping the order.
   */
  shipping_method?: {
    /**
     * The ID of the shipping provider.
     */
    provider_id?: string
    /**
     * The ID of the shipping profile.
     */
    profile_id?: string
    /**
     * The price of the shipping.
     */
    price?: number
    /**
     * Data relevant to the specific shipping method.
     */
    data?: Record<string, any>
    /**
     * Items to ship
     */
    items?: Array<LineItem>
  }
  /**
   * A flag to indicate if no notifications should be emitted related to the updated order.
   */
  no_notification?: boolean
}
