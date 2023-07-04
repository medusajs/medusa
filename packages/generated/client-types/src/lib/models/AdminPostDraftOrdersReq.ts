/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface AdminPostDraftOrdersReq {
  /**
   * The status of the draft order
   */
  status?: "open" | "completed"
  /**
   * The email of the customer of the draft order
   */
  email: string
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The Address to be used for shipping.
   */
  shipping_address?: AddressPayload | string
  /**
   * The Line Items that have been received.
   */
  items?: Array<{
    /**
     * The ID of the Product Variant to generate the Line Item from.
     */
    variant_id?: string
    /**
     * The potential custom price of the item.
     */
    unit_price?: number
    /**
     * The potential custom title of the item.
     */
    title?: string
    /**
     * The quantity of the Line Item.
     */
    quantity: number
    /**
     * The optional key-value map with additional details about the Line Item.
     */
    metadata?: Record<string, any>
  }>
  /**
   * The ID of the region for the draft order
   */
  region_id: string
  /**
   * The discounts to add on the draft order
   */
  discounts?: Array<{
    /**
     * The code of the discount to apply
     */
    code: string
  }>
  /**
   * The ID of the customer to add on the draft order
   */
  customer_id?: string
  /**
   * An optional flag passed to the resulting order to determine use of notifications.
   */
  no_notification_order?: boolean
  /**
   * The shipping methods for the draft order
   */
  shipping_methods: Array<{
    /**
     * The ID of the shipping option in use
     */
    option_id: string
    /**
     * The optional additional data needed for the shipping method
     */
    data?: Record<string, any>
    /**
     * The potential custom price of the shipping
     */
    price?: number
  }>
  /**
   * The optional key-value map with additional details about the Draft Order.
   */
  metadata?: Record<string, any>
}
