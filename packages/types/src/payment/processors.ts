import { PaymentSessionDTO, PaymentSessionStatus } from "./common"

/**
 * @interface
 *
 * A payment's context.
 */
export type PaymentProcessorContext = {
  /**
   * The payment's billing address.
   */
  billing_address?: Record<string, unknown> | null // TODO: revisit types
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
  customer?: Record<string, unknown> // TODO: type
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

export type PaymentProcessorAuthorizeResponse = {
  /**
   * The status of the payment, which will be stored in the payment session's `status` field.
   */
  status: PaymentSessionStatus
  /**
   * The `data` to be stored in the payment session's `data` field.
   */
  data: PaymentProcessorSessionResponse["session_data"]
}

export type PaymentSessionInput = {
  payment_session_id?: string
  provider_id: string

  cart_id?: string
  email: string

  // cart:
  //   | Cart
  //   | {
  //       context: Record<string, unknown>
  //       id: string
  //       email: string
  //       shipping_address: Address | null
  //       shipping_methods: ShippingMethod[]
  //       billing_address?: Address | null
  //     }

  customer_id: string
  // customer?: Customer | null

  currency_code: string
  amount: number
  resource_id: string
  paymentSessionData?: Record<string, unknown>
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

export interface IPaymentProcessor {
  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment plugin provider
   */
  getIdentifier(): string

  /**
   * This method is called either if a region has only one payment provider enabled or when [a Payment Session is selected](https://docs.medusajs.com/api/store#carts_postcartscartpaymentsession),
   * which occurs when the customer selects their preferred payment method during checkout.
   *
   * It is used to allow you to make any necessary calls to the third-party provider to initialize the payment. For example, in Stripe this method is used to create a Payment Intent for the customer.
   *
   * @param {PaymentProcessorContext} context - The context of the payment.
   * @returns {Promise<PaymentProcessorError | PaymentProcessorSessionResponse>} Either the payment's data or an error object.
   */
  initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  /**
   * This method is used to update the payment session when the payment amount changes. It's called whenever the cart or any of its related data is updated.
   * For example, when a [line item is added to the cart](https://docs.medusajs.com/api/store#carts_postcartscartlineitems) or when a
   * [shipping method is selected](https://docs.medusajs.com/api/store#carts_postcartscartshippingmethod).
   *
   * @param {PaymentProcessorContext} context - The context of the payment.
   * @returns {Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void>} Either the payment's data or an error object.
   */
  updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void>

  /**
   * This method is used to refund an order’s payment. This is typically triggered manually by the store operator from the admin. The refund amount might be the total order amount or part of it.
   *
   * This method is also used for refunding payments of a swap or a claim of an order, or when a request is sent to the [Refund Payment API Route](https://docs.medusajs.com/api/admin#payments_postpaymentspaymentrefunds).
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
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * This method is used to authorize payment using the Payment Session of an order. This is called when the
   * [cart is completed](https://docs.medusajs.com/api/store#carts_postcartscartcomplete) and before the order is created.
   *
   * This method is also used for authorizing payments of a swap of an order and when authorizing sessions in a payment collection.
   * You can interact with a third-party provider and perform any actions necessary to authorize the payment.
   *
   * The payment authorization might require additional action from the customer before it is declared authorized. Once that additional action is performed,
   * the `authorizePayment` method will be called again to validate that the payment is now fully authorized. So, make sure to implement it for this case as well, if necessary.
   *
   * Once the payment is authorized successfully and the Payment Session status is set to `authorized`, the associated order or swap can then be placed or created.
   * If the payment authorization fails, then an error will be thrown and the order will not be created.
   *
   * :::note
   *
   * The payment authorization status is determined using the {@link getPaymentStatus} method. If the status is `requires_more`, then it means additional actions are required
   * from the customer. If you try to create the order with a status that isn't `authorized`, the process will fail.
   *
   * :::
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the payment session.
   * @param {Record<string, unknown>} context -
   * The context of the authorization. It may include some of the following fields:
   *
   * - `ip`: The customer’s IP.
   * - `idempotency_key`: The [Idempotency Key](https://docs.medusajs.com/modules/carts-and-checkout/payment#idempotency-key) that is associated with the current cart. It is useful when retrying payments, retrying checkout at a failed point, or for payments that require additional actions from the customer.
   * - `cart_id`: The ID of a cart. This is only during operations like placing an order or creating a swap.
   *
   * @returns The authorization details or an error object.
   */
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProcessorError | PaymentProcessorAuthorizeResponse>

  /**
   * This method is used to capture the payment amount of an order. This is typically triggered manually by the store operator from the admin.
   *
   * This method is also used for capturing payments of a swap of an order, or when a request is sent to the [Capture Payment API Route](https://docs.medusajs.com/api/admin#payments_postpaymentspaymentcapture).
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment for its first parameter.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   */
  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * This method is used to perform any actions necessary before a Payment Session is deleted. The Payment Session is deleted in one of the following cases:
   *
   * 1. When a request is sent to [delete the Payment Session](https://docs.medusajs.com/api/store#carts_deletecartscartpaymentsessionssession).
   * 2. When the [Payment Session is refreshed](https://docs.medusajs.com/api/store#carts_postcartscartpaymentsessionssession). The Payment Session is deleted so that a newer one is initialized instead.
   * 3. When the Payment Processor is no longer available. This generally happens when the store operator removes it from the available Payment Processor in the admin.
   * 4. When the region of the store is changed based on the cart information and the Payment Processor is not available in the new region.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment Session.
   * @returns Either an error object or an empty object.
   */
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * This method is used to provide a uniform way of retrieving the payment information from the third-party provider.
   * For example, in Stripe’s Payment Processor this method is used to retrieve the payment intent details from Stripe.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a Payment Session. Make sure to store in the `data` field any necessary data that would allow you to retrieve the payment data from the third-party provider.
   * @returns {Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]>} The payment's data, typically retrieved from a third-party provider.
   */
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * This method is used to cancel an order’s payment. This method is typically triggered by one of the following situations:
   *
   * 1. Before an order is placed and after the payment is authorized, an inventory check is done on products to ensure that products are still available for purchase. If the inventory check fails for any of the products, the payment is canceled.
   * 2. If the store operator cancels the order from the admin.
   * 3. When the payment of an order's swap is canceled.
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to cancel the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   */
  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * This method is used to get the status of a Payment or a Payment Session. Its main usage is within the place order and create swap flows.
   * If the status returned is not `authorized` within these flows, then the payment is considered failed and an error will be thrown, stopping the flow from completion.
   *
   * @param {Record<string, unknown>} paymentSessionData -
   * The `data` field of a Payment as a parameter. You can use this data to interact with the third-party provider to check the status of the payment if necessary.
   * @returns {Promise<PaymentSessionStatus>} The status of the Payment or Payment Session.
   */
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  /**
   * This method is used to update the `data` field of a payment session. It's called when a request is sent to the
   * [Update Payment Session API Route](https://docs.medusajs.com/api/store#carts_postcartscartpaymentsessionupdate), or when the `CartService`'s `updatePaymentSession` is used.
   *
   * This method can also be used to update the data in the third-party payment provider, if necessary.
   *
   * @param {string} sessionId - The ID of the payment session.
   * @param {Record<string, unknown>} data - The data to be updated in the payment session.
   * @returns {Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]>} the data to store in the `data` field of the payment session.
   * You can keep the data as-is, or make changes to it by communicating with the third-party provider.
   */
  updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >
}
