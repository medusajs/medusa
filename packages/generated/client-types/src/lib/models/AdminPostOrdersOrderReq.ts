/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"
import type { Discount } from "./Discount"
import type { LineItem } from "./LineItem"

export interface AdminPostOrdersOrderReq {
  /**
   * The email associated with the order
   */
  email?: string
  /**
   * The order's billing address
   */
  billing_address?: AddressPayload
  /**
   * The order's shipping address
   */
  shipping_address?: AddressPayload
  /**
   * The line items of the order
   */
  items?: Array<LineItem>
  /**
   * ID of the region that the order is associated with.
   */
  region?: string
  /**
   * The discounts applied to the order
   */
  discounts?: Array<Discount>
  /**
   * The ID of the customer associated with the order.
   */
  customer_id?: string
  /**
   * The payment method chosen for the order.
   */
  payment_method?: {
    /**
     * The ID of the payment provider.
     */
    provider_id?: string
    /**
     * Any data relevant for the given payment method.
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
     * Any data relevant to the specific shipping method.
     */
    data?: Record<string, any>
    /**
     * Items to ship
     */
    items?: Array<LineItem>
  }
  /**
   * If set to `true`, no notification will be sent to the customer related to this order.
   */
  no_notification?: boolean
}
