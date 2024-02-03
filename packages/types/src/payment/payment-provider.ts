// import { Address, Customer, PaymentSessionStatus } from "../models"
// import { MedusaContainer } from "../types/global"

import { AddressDTO } from "../address"
import { CustomerDTO } from "../customer"

/**
 * @interface
 *
 * A payment's context.
 */
export type PaymentProcessorContext = {
  /**
   * The payment's billing address.
   */
  billing_address?: AddressDTO | null
  /**
   * The customer's email.
   */
  email: string
  /**
   * The selected currency code, typically associated with the customer's cart.
   */
  currency_code: string
  /**
   * The payment's amount.
   */
  amount: number
  /**
   * The ID of the resource the payment is associated with. For example, the cart's ID.
   */
  resource_id: string
  /**
   * The customer associated with this payment.
   */
  customer?: CustomerDTO
  /**
   * The cart's context.
   */
  context: Record<string, unknown>
  /**
   * If the payment session hasn't been created or initiated yet, it'll be an empty object.
   * If the payment session exists, it'll be the value of the payment session's `data` field.
   */
  paymentSessionData: Record<string, unknown>
}

/**
 * @interface
 *
 * The response of operations on a payment.
 */
export type PaymentProcessorSessionResponse = {
  /**
   * Used to specify data that should be updated in the Medusa backend.
   */
  update_requests?: {
    /**
     * Specifies a new value of the `metadata` field of the customer associated with the payment.
     */
    customer_metadata?: Record<string, unknown>
  }
  /**
   * The data to be stored in the `data` field of the Payment Session to be created.
   * The `data` field is useful to hold any data required by the third-party provider to process the payment or retrieve its details at a later point.
   */
  session_data: Record<string, unknown>
}

/**
 * An object that is returned in case of an error.
 */
export interface PaymentProcessorError {
  /**
   * The error message
   */
  error: string
  /**
   * The error code.
   */
  code?: string
  /**
   * Any additional helpful details.
   */
  detail?: any
}

export interface IPaymentProviderService {}
