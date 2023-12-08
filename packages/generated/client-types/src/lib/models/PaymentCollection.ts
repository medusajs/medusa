/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"
import type { Payment } from "./Payment"
import type { PaymentSession } from "./PaymentSession"
import type { Region } from "./Region"

/**
 * A payment collection allows grouping and managing a list of payments at one. This can be helpful when making additional payment for order edits or integrating installment payments.
 */
export interface PaymentCollection {
  /**
   * The payment collection's ID
   */
  id: string
  /**
   * The type of the payment collection
   */
  type: "order_edit"
  /**
   * The type of the payment collection
   */
  status:
    | "not_paid"
    | "awaiting"
    | "authorized"
    | "partially_authorized"
    | "canceled"
  /**
   * Description of the payment collection
   */
  description: string | null
  /**
   * Amount of the payment collection.
   */
  amount: number
  /**
   * Authorized amount of the payment collection.
   */
  authorized_amount: number | null
  /**
   * The ID of the region this payment collection is associated with.
   */
  region_id: string
  /**
   * The details of the region this payment collection is associated with.
   */
  region?: Region | null
  /**
   * The three character ISO code for the currency this payment collection is associated with.
   */
  currency_code: string
  /**
   * The details of the currency this payment collection is associated with.
   */
  currency?: Currency | null
  /**
   * The details of the payment sessions created as part of the payment collection.
   */
  payment_sessions?: Array<PaymentSession>
  /**
   * The details of the payments created as part of the payment collection.
   */
  payments?: Array<Payment>
  /**
   * The ID of the user that created the payment collection.
   */
  created_by: string
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
