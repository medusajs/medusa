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
 * A swap can be created when a Customer wishes to exchange Products that they have purchased with different Products. It consists of a Return of previously purchased Products and a Fulfillment of new Products. It also includes information on any additional payment or refund required based on the difference between the exchanged products.
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
   * The ID of the order that the swap belongs to.
   */
  order_id: string
  /**
   * The details of the order that the swap belongs to.
   */
  order?: Order | null
  /**
   * The details of the new products to send to the customer, represented as line items.
   */
  additional_items?: Array<LineItem>
  /**
   * The details of the return that belongs to the swap, which holds the details on the items being returned.
   */
  return_order?: Return | null
  /**
   * The details of the fulfillments that are used to send the new items to the customer.
   */
  fulfillments?: Array<Fulfillment>
  /**
   * The details of the additional payment authorized by the customer when `difference_due` is positive.
   */
  payment?: Payment | null
  /**
   * The difference amount between the order’s original total and the new total imposed by the swap. If its value is negative, a refund must be issues to the customer. If it's positive, additional payment must be authorized by the customer. Otherwise, no payment processing is required.
   */
  difference_due: number | null
  /**
   * The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order.
   */
  shipping_address_id: string | null
  /**
   * The details of the shipping address that the new items should be sent to.
   */
  shipping_address?: Address | null
  /**
   * The details of the shipping methods used to fulfill the additional items purchased.
   */
  shipping_methods?: Array<ShippingMethod>
  /**
   * The ID of the cart that the customer uses to complete the swap.
   */
  cart_id: string | null
  /**
   * The details of the cart that the customer uses to complete the swap.
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
