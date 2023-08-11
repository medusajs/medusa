/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface AdminPostDraftOrdersReq {
  /**
   * The status of the draft order. The draft order's default status is `open`. It's changed to `completed` when its payment is marked as paid.
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
   * The Address to be used for shipping purposes.
   */
  shipping_address?: AddressPayload | string
  /**
   * The draft order's line items.
   */
  items?: Array<{
    /**
     * The ID of the Product Variant associated with the line item. If the line item is custom, the `variant_id` should be omitted.
     */
    variant_id?: string
    /**
     * The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
     */
    unit_price?: number
    /**
     * The title of the line item if `variant_id` is not provided.
     */
    title?: string
    /**
     * The quantity of the line item.
     */
    quantity: number
    /**
     * The optional key-value map with additional details about the line item.
     */
    metadata?: Record<string, any>
  }>
  /**
   * The ID of the region for the draft order
   */
  region_id: string
  /**
   * The discounts to add to the draft order
   */
  discounts?: Array<{
    /**
     * The code of the discount to apply
     */
    code: string
  }>
  /**
   * The ID of the customer this draft order is associated with.
   */
  customer_id?: string
  /**
   * An optional flag passed to the resulting order that indicates whether the customer should receive notifications about order updates.
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
     * The price of the shipping method.
     */
    price?: number
  }>
  /**
   * The optional key-value map with additional details about the Draft Order.
   */
  metadata?: Record<string, any>
}
