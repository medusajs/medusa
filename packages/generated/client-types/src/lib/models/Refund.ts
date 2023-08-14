/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Order } from "./Order"
import type { Payment } from "./Payment"

/**
 * A refund represents an amount of money transfered back to the customer for a given reason. Refunds may occur in relation to Returns, Swaps and Claims, but can also be initiated by an admin for an order.
 */
export interface Refund {
  /**
   * The refund's ID
   */
  id: string
  /**
   * The ID of the order this refund was created for.
   */
  order_id: string | null
  /**
   * The details of the order this refund was created for.
   */
  order?: Order | null
  /**
   * The payment's ID, if available.
   */
  payment_id: string | null
  /**
   * The details of the payment associated with the refund.
   */
  payment?: Payment | null
  /**
   * The amount that has be refunded to the Customer.
   */
  amount: number
  /**
   * An optional note explaining why the amount was refunded.
   */
  note: string | null
  /**
   * The reason given for the Refund, will automatically be set when processed as part of a Swap, Claim or Return.
   */
  reason: "discount" | "return" | "swap" | "claim" | "other"
  /**
   * Randomly generated key used to continue the completion of the refund in case of failure.
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
