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
export enum PaymentActions {
  /**
   * Payment session has been authorized and there are available funds for capture.
   */
  AUTHORIZED = "authorized",

  /**
   * Payment was successful and the mount is captured.
   */
  SUCCESSFUL = "captured",

  /**
   * Payment failed.
   */
  FAILED = "failed",

  /**
   * Received an event that is not processable.
   */
  NOT_SUPPORTED = "not_supported",
}

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
   * The ID of the resource the payment is associated with. For example, the ID of the payment session.
   */
  resource_id?: string

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
   * The associated resource's ID. For example,
   * a payment session's ID.
   */
  resource_id: string

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
      action: PaymentActions.NOT_SUPPORTED
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
   * Return a unique identifier to retrieve the payment plugin provider
   */
  getIdentifier(): string

  /**
   * This methods sends a request to the third-party provider to initialize the payment. It's called when the payment session is created.
   *
   * For example, in the Stripe provider, this method is used to create a Payment Intent for the customer.
   *
   * @param {CreatePaymentProviderSession} data - The data necessary to initiate the payment.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse>} Either the payment's data, which is stored in the `data` field
   * of the payment session, or an error object.
   */
  initiatePayment(
    data: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  /**
   * This method is used to update a payment associated with a session in the third-party provider.
   *
   * @param {UpdatePaymentProviderSession} context - The data related to the update.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse | void>} Either the payment's data or an error object.
   */
  updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  /**
   * This method is called before a payment session is deleted. It's used to perform any actions necessary before the deletion.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment Session.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>} Either an error object or an empty object.
   */
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  /**
   * This method is called when a payment session should be authorized.
   * You can interact with a third-party provider and perform the necessary actions to authorize the payment.
   *
   * Refer to [this guide](https://docs.medusajs.com/experimental/payment/payment-flow/#3-authorize-payment-session)
   * to learn more about how this fits into the payment flow and how to handle required actions.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the payment session.
   * @param {Record<string, unknown>} context - The context of the authorization.
   * @returns {Promise<PaymentProviderError | PaymentProviderAuthorizeResponse>} The authorization details or an error object. If
   * the authorization details are returned, the `data` and `status` field are set in the associated payment session.
   */
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderAuthorizeResponse>

  /**
   * This method is called when a payment should be captured. The payment is captured in one of the following scenarios:
   *
   * - The payment provider supports automatically capturing the payment after authorization.
   * - The merchant requests to capture the payment after its associated payment session was authorized.
   * - A webhook event occurred that instructs the payment provider to capture the payment session. Learn more about handing webhook events in [this guide](https://docs.medusajs.com/experimental/payment/webhook-events/)
   *
   * In this method, you can interact with the third-party provider and perform any actions necessary to capture the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the payment.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>} Either an error object or a value that's stored in the `data` field of the payment.
   */
  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  /**
   * This method is called when a payment should be refunded. This is typically triggered manually by the merchant.
   *
   * In this method, you can interact with the third-party provider and perform any actions necessary to refund the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of a Payment.
   * @param {BigNumberInput} refundAmount - The amount to refund.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>} Either an error object or an object that's stored in the `data` field of the payment.
   */
  refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: BigNumberInput
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  /**
   * This method is used to provide a uniform way of retrieving the payment information from the third-party provider.
   *
   * For example, in Stripe’s payment provider this method is used to retrieve the payment intent details from Stripe.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a payment session. Make sure to store in the `data` field any necessary data that would allow you to retrieve the payment data from the third-party provider.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["session_data"]>} Either an error object or the payment's data retrieved from a third-party provider.
   */
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  /**
   * This method is called when a payment is canceled.
   *
   * In this method, you can interact with the third-party provider and perform any actions necessary to cancel the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the payment.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>} Either an error object or a value that's stored in the `data` field of the payment.
   */
  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  /**
   * This method is used to get the status of a payment or a payment session.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a payment as a parameter. You can use this data to interact with the third-party provider to check the status of the payment if necessary.
   * @returns {Promise<PaymentSessionStatus>} The status of the payment or payment session.
   */
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  /**
   * The method is called when a webhook event is received for this provider.
   *
   * The method is responsible for normalizing the received event and inform the Payment Module of actions to perform, such as authorize or capture payment.
   *
   * Learn more about handling webhook events in [this guide](https://docs.medusajs.com/experimental/payment/webhook-events/)
   *
   * @param data - The webhook event's details.
   */
  getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult>
}
