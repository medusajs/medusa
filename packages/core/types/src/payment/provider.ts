import { AddressDTO } from "../address"
import { CustomerDTO } from "../customer"
import { BigNumberInput, BigNumberValue } from "../totals"
import { PaymentSessionStatus } from "./common"
import { ProviderWebhookPayload } from "./mutations"

/**
 * The address of the payment.
 */
export type PaymentAddressDTO = Partial<AddressDTO>

/**
 * The customer associated with the payment.
 */
export type PaymentCustomerDTO = Partial<CustomerDTO>

/**
 * Normalized events from payment provider to internal payment module events.
 */
export type PaymentActions =
  | "authorized"
  | "captured"
  | "failed"
  | "not_supported"

/**
 * @interface
 *
 * Context data provided to the payment provider when authorizing a payment session.
 */
export type PaymentProviderContext = {
  /**
   * The payment's billing address.
   */
  billing_address?: PaymentAddressDTO

  /**
   * The associated customer's email.
   */
  email?: string

  /**
   * The ID of payment session the provider payment is associated with.
   */
  session_id?: string

  /**
   * The customer associated with this payment.
   */
  customer?: PaymentCustomerDTO

  /**
   * The extra fields specific to the provider session.
   */
  extra?: Record<string, unknown>
}

/**
 * @interface
 *
 * The data used initiate a payment in a provider when a payment
 * session is created.
 */
export type CreatePaymentProviderSession = {
  /**
   * A context necessary for the payment provider.
   */
  context: PaymentProviderContext

  /**
   * The amount to be authorized.
   */
  amount: BigNumberInput

  /**
   * The ISO 3 character currency code.
   */
  currency_code: string
}

/**
 * @interface
 *
 * The attributes to update a payment related to a payment session in a provider.
 */
export type UpdatePaymentProviderSession = {
  /**
   * A payment's context.
   */
  context: PaymentProviderContext

  /**
   * The `data` field of the payment session.
   */
  data: Record<string, unknown>

  /**
   * The payment session's amount.
   */
  amount: BigNumberInput

  /**
   * The ISO 3 character code of the payment session.
   */
  currency_code: string
}

/**
 * @interface
 *
 * The response of operations on a payment.
 */
export type PaymentProviderSessionResponse = {
  /**
   * The data to be stored in the `data` field of the Payment Session to be created.
   * The `data` field is useful to hold any data required by the third-party provider to process the payment or retrieve its details at a later point.
   */
  data: Record<string, unknown>
}

/**
 * @interface
 *
 * The successful result of authorizing a payment session using a payment provider.
 */
export type PaymentProviderAuthorizeResponse = {
  /**
   * The status of the payment, which will be stored in the payment session's `status` field.
   */
  status: PaymentSessionStatus

  /**
   * The `data` to be stored in the payment session's `data` field.
   */
  data: PaymentProviderSessionResponse["data"]
}

/**
 * @interface
 *
 * The details of which payment provider to use to perform an action, and what
 * data to be passed to that provider.
 */
export type PaymentProviderDataInput = {
  /**
   * The ID of the provider to be used to perform an action.
   */
  provider_id: string

  /**
   * The data to be passed to the provider.
   */
  data: Record<string, unknown>
}

/**
 * An object that is returned in case of an error.
 */
export interface PaymentProviderError {
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

/**
 * @interface
 *
 * The details of an action to be performed as a result of a received webhook event.
 */
export type WebhookActionData = {
  /**
   * The associated payment session's ID.
   */
  session_id: string

  /**
   * The amount to be captured or authorized (based on the action's type.)
   */
  amount: BigNumberValue
}

/**
 * @interface
 *
 * The actions that the payment provider informs the Payment Module to perform.
 */
export type WebhookActionResult =
  | {
      /**
       * Received an event that is not processable.
       */
      action: "not_supported"
    }
  | {
      /**
       * Normalized events from payment provider to internal payment module events.
       */
      action: PaymentActions

      /**
       * The webhook action's details.
       */
      data: WebhookActionData
    }

export interface IPaymentProvider {
  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment module provider
   */
  getIdentifier(): string

  initiatePayment(
    data: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderAuthorizeResponse>

  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: BigNumberInput
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult>
}
