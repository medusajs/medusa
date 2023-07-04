/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"
import type { Payment } from "./Payment"
import type { PaymentSession } from "./PaymentSession"
import type { Region } from "./Region"

/**
 * Payment Collection
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
   * The region's ID
   */
  region_id: string
  /**
   * Available if the relation `region` is expanded.
   */
  region?: Region | null
  /**
   * The 3 character ISO code for the currency.
   */
  currency_code: string
  /**
   * Available if the relation `currency` is expanded.
   */
  currency?: Currency | null
  /**
   * Available if the relation `payment_sessions` is expanded.
   */
  payment_sessions?: Array<PaymentSession>
  /**
   * Available if the relation `payments` is expanded.
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
