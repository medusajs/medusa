/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"

/**
 * Payment Sessions are created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, who is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for capture/refunds/etc.
 */
export interface PaymentSession {
  /**
   * The payment session's ID
   */
  id: string
  /**
   * The id of the Cart that the Payment Session is created for.
   */
  cart_id: string | null
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Cart | null
  /**
   * The id of the Payment Provider that is responsible for the Payment Session
   */
  provider_id: string
  /**
   * A flag to indicate if the Payment Session has been selected as the method that will be used to complete the purchase.
   */
  is_selected: boolean | null
  /**
   * A flag to indicate if a communication with the third party provider has been initiated.
   */
  is_initiated: boolean
  /**
   * Indicates the status of the Payment Session. Will default to `pending`, and will eventually become `authorized`. Payment Sessions may have the status of `requires_more` to indicate that further actions are to be completed by the Customer.
   */
  status: "authorized" | "pending" | "requires_more" | "error" | "canceled"
  /**
   * The data required for the Payment Provider to identify, modify and process the Payment Session. Typically this will be an object that holds an id to the external payment session, but can be an empty object if the Payment Provider doesn't hold any state.
   */
  data: Record<string, any>
  /**
   * Randomly generated key used to continue the completion of a cart in case of failure.
   */
  idempotency_key: string | null
  /**
   * The amount that the Payment Session has been authorized for.
   */
  amount: number | null
  /**
   * The date with timezone at which the Payment Session was authorized.
   */
  payment_authorized_at: string | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
}
