/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Address } from "./Address"
import type { Cart } from "./Cart"
import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"
import type { Order } from "./Order"
import type { Payment } from "./Payment"
import type { Return } from "./Return"
import type { ShippingMethod } from "./ShippingMethod"

/**
 * Swaps can be created when a Customer wishes to exchange Products that they have purchased to different Products. Swaps consist of a Return of previously purchased Products and a Fulfillment of new Products, the amount paid for the Products being returned will be used towards payment for the new Products. In the case where the amount paid for the the Products being returned exceed the amount to be paid for the new Products, a Refund will be issued for the difference.
 */
export interface Swap {
  /**
   * The swap's ID
   */
  id: string
  /**
   * The status of the Fulfillment of the Swap.
   */
  fulfillment_status:
    | "not_fulfilled"
    | "fulfilled"
    | "shipped"
    | "partially_shipped"
    | "canceled"
    | "requires_action"
  /**
   * The status of the Payment of the Swap. The payment may either refer to the refund of an amount or the authorization of a new amount.
   */
  payment_status:
    | "not_paid"
    | "awaiting"
    | "captured"
    | "confirmed"
    | "canceled"
    | "difference_refunded"
    | "partially_refunded"
    | "refunded"
    | "requires_action"
  /**
   * The ID of the Order where the Line Items to be returned where purchased.
   */
  order_id: string
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Order | null
  /**
   * The new Line Items to ship to the Customer. Available if the relation `additional_items` is expanded.
   */
  additional_items?: Array<LineItem>
  /**
   * A return order object. The Return that is issued for the return part of the Swap. Available if the relation `return_order` is expanded.
   */
  return_order?: Return | null
  /**
   * The Fulfillments used to send the new Line Items. Available if the relation `fulfillments` is expanded.
   */
  fulfillments?: Array<Fulfillment>
  /**
   * The Payment authorized when the Swap requires an additional amount to be charged from the Customer. Available if the relation `payment` is expanded.
   */
  payment?: Payment | null
  /**
   * The difference that is paid or refunded as a result of the Swap. May be negative when the amount paid for the returned items exceed the total of the new Products.
   */
  difference_due: number | null
  /**
   * The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order.
   */
  shipping_address_id: string | null
  /**
   * Available if the relation `shipping_address` is expanded.
   */
  shipping_address?: Address | null
  /**
   * The Shipping Methods used to fulfill the additional items purchased. Available if the relation `shipping_methods` is expanded.
   */
  shipping_methods?: Array<ShippingMethod>
  /**
   * The id of the Cart that the Customer will use to confirm the Swap.
   */
  cart_id: string | null
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Cart | null
  /**
   * The date with timezone at which the Swap was confirmed by the Customer.
   */
  confirmed_at: string | null
  /**
   * The date with timezone at which the Swap was canceled.
   */
  canceled_at: string | null
  /**
   * If set to true, no notification will be sent related to this swap
   */
  no_notification: boolean | null
  /**
   * If true, swaps can be completed with items out of stock
   */
  allow_backorder: boolean
  /**
   * Randomly generated key used to continue the completion of the swap in case of failure.
   */
  idempotency_key: string | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
