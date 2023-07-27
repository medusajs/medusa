/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Currency } from "./Currency"
import type { Order } from "./Order"
import type { Swap } from "./Swap"

/**
 * A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources.
 */
export interface Payment {
  /**
   * The payment's ID
   */
  id: string
  /**
   * The ID of the swap that this payment was potentially created for.
   */
  swap_id: string | null
  /**
   * The details of the swap that this payment was potentially created for.
   */
  swap?: Swap | null
  /**
   * The ID of the cart that the payment session was potentially created for.
   */
  cart_id: string | null
  /**
   * The details of the cart that the payment session was potentially created for.
   */
  cart?: Cart | null
  /**
   * The ID of the order that the payment session was potentially created for.
   */
  order_id: string | null
  /**
   * The details of the order that the payment session was potentially created for.
   */
  order?: Order | null
  /**
   * The amount that the Payment has been authorized for.
   */
  amount: number
  /**
   * The 3 character ISO currency code of the payment.
   */
  currency_code: string
  /**
   * The details of the currency of the payment.
   */
  currency?: Currency | null
  /**
   * The amount of the original Payment amount that has been refunded back to the Customer.
   */
  amount_refunded: number
  /**
   * The id of the Payment Provider that is responsible for the Payment
   */
  provider_id: string
  /**
   * The data required for the Payment Provider to identify, modify and process the Payment. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state.
   */
  data: Record<string, any>
  /**
   * The date with timezone at which the Payment was captured.
   */
  captured_at: string | null
  /**
   * The date with timezone at which the Payment was canceled.
   */
  canceled_at: string | null
  /**
   * Randomly generated key used to continue the completion of a payment in case of failure.
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
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
