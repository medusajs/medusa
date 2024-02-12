import { PaymentSessionDTO, PaymentSessionStatus } from "./common"

/**
 * @interface
 *
 * A payment's context.
 */
export type PaymentProviderContext = {
  /**
   * The payment's billing address.
   */
  billing_address?: Record<string, unknown> | null // TODO: revisit types
  /**
   * The customer's email.
   */
  email?: string
  /**
   * The selected currency code.
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
  customer?: Record<string, unknown> // TODO: type
  /**
   * The context.
   */
  context: Record<string, unknown>
  /**
   * If the payment session hasn't been created or initiated yet, it'll be an empty object.
   * If the payment session exists, it'll be the value of the payment session's `data` field.
   */
  payment_session_data: Record<string, unknown>
}

/**
 * @interface
 *
 * The response of operations on a payment.
 */
export type PaymentProviderSessionResponse = {
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

export type PaymentProviderAuthorizeResponse = {
  /**
   * The status of the payment, which will be stored in the payment session's `status` field.
   */
  status: PaymentSessionStatus
  /**
   * The `data` to be stored in the payment session's `data` field.
   */
  data: PaymentProviderSessionResponse["session_data"]
}

export type CreatePaymentInput = {
  amount: number
  currency_code: string
  provider_id?: string
  payment_session: PaymentSessionDTO
  resource_id?: string
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

export interface IPaymentProvider {
  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment plugin provider
   */
  getIdentifier(): string

  /**
   * Make calls to the third-party provider to initialize the payment. For example, in Stripe this method is used to create a Payment Intent for the customer.
   *
   * @param {PaymentProviderContext} context - The context of the payment.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse>} Either the payment's data or an error object.
   */
  initiatePayment(
    context: PaymentProviderContext
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  /**
   * This method is used to update the payment session when the payment amount changes.
   *
   * @param {PaymentProviderContext} context - The context of the payment.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse | void>} Either the payment's data or an error object.
   */
  updatePayment(
    context: PaymentProviderContext
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse | void>

  /**
   * This method is used to refund a payment. This is typically triggered manually by the store operator from the admin. The refund amount might be the total amount or part of it.
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to refund the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of a Payment.
   * @param {number} refundAmount - the amount to refund.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   */
  refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >

  /**
   * This method is used to authorize payment using the Payment Session.
   * You can interact with a third-party provider and perform any actions necessary to authorize the payment.
   *
   * The payment authorization might require additional action from the customer before it is declared authorized. Once that additional action is performed,
   * the `authorizePayment` method will be called again to validate that the payment is now fully authorized. So, make sure to implement it for this case as well, if necessary.
   *
   * :::note
   *
   * The payment authorization status is determined using the {@link getPaymentStatus} method. If the status is `requires_more`, then it means additional actions are required
   * from the customer.
   *
   * :::
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the payment session.
   * @param {Record<string, unknown>} context - The context of the authorization.
   * @returns The authorization details or an error object.
   */
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderAuthorizeResponse>

  /**
   * This method is used to capture the payment amount. This is typically triggered manually by the store operator from the admin.
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment for its first parameter.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   */
  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >

  /**
   * This method is used to perform any actions necessary before a Payment Session is deleted. The Payment Session is deleted in one of the following cases:
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment Session.
   * @returns Either an error object or an empty object.
   */
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >

  /**
   * This method is used to provide a uniform way of retrieving the payment information from the third-party provider.
   * For example, in Stripe’s Payment Provider this method is used to retrieve the payment intent details from Stripe.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a Payment Session. Make sure to store in the `data` field any necessary data that would allow you to retrieve the payment data from the third-party provider.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["session_data"]>} The payment's data, typically retrieved from a third-party provider.
   */
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >

  /**
   * This method is used to cancel a payment. This method is typically triggered by one of the following situations:
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to cancel the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   */
  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >

  /**
   * This method is used to get the status of a Payment or a Payment Session.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a Payment as a parameter. You can use this data to interact with the third-party provider to check the status of the payment if necessary.
   * @returns {Promise<PaymentSessionStatus>} The status of the Payment or Payment Session.
   */
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  /**
   * This method is used to update the `data` field of a payment session.
   *
   * This method can also be used to update the data in the third-party payment provider, if necessary.
   *
   * @param {string} sessionId - The ID of the payment session.
   * @param {Record<string, unknown>} data - The data to be updated in the payment session.
   * @returns {Promise<PaymentProviderError | PaymentProviderSessionResponse["session_data"]>} the data to store in the `data` field of the payment session.
   * You can keep the data as-is, or make changes to it by communicating with the third-party provider.
   */
  updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<
    PaymentProviderError | PaymentProviderSessionResponse["session_data"]
  >
}
