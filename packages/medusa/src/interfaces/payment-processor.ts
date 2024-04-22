import { Address, Customer, PaymentSessionStatus } from "../models"
import { MedusaContainer } from "../types/global"

/**
 * @interface
 *
 * A payment's context.
 */
export type PaymentProcessorContext = {
  /**
   * The payment's billing address.
   */
  billing_address?: Address | null
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
  customer?: Customer
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

/**
 * ## Overview
 *
 * A Payment Processor is the payment method used to authorize, capture, and refund payment, among other actions. An example of a Payment Processor is Stripe.
 *
 * By default, Medusa has a `manual` payment provider that has minimal implementation. It can be synonymous with a Cash on Delivery payment method. It allows
 * store operators to manage the payment themselves but still keep track of its different stages on Medusa.
 *
 * A payment processor is a service that extends the `AbstractPaymentProcessor` and implements its methods. So, adding a Payment Processor is as simple as
 * creating a service file in `src/services`. The file's name is the payment processor's class name as a slug and without the word `Service`.
 * For example, if you're creating a `MyPaymentService` class, the file name is `src/services/my-payment.ts`.
 *
 * ```ts
 * import { AbstractPaymentProcessor } from "@medusajs/medusa";
 *
 * class MyPaymentService extends AbstractPaymentProcessor {
 *   // methods here...
 * }
 *
 * export default MyPaymentService
 * ```
 *
 * The methods of the payment processor are used at different points in the Checkout flow as well as when processing an order after it’s placed.
 *
 * ![Checkout Flow - Payment](https://res.cloudinary.com/dza7lstvk/image/upload/v1680177820/Medusa%20Docs/Diagrams/checkout-payment_cy9efp.jpg)
 *
 * ---
 *
 * ## Identifier Property
 *
 * The `PaymentProvider` entity has 2 properties: `id` and `is_installed`. The `identifier` property in the payment processor service is used when the payment processor is added to the database.
 *
 * The value of this property is also used to reference the payment processor throughout Medusa.
 * For example, it is used to [add a payment processor](https://docs.medusajs.com/api/admin#regions_postregionsregionpaymentproviders) to a region.
 *
 * ```ts
 * class MyPaymentService extends AbstractPaymentProcessor {
 *   static identifier = "my-payment"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## PaymentProcessorError
 *
 * Before diving into the methods of the Payment Processor, you'll notice that part of the expected return signature of these method includes `PaymentProcessorError`.
 *
 * ```ts
 * interface PaymentProcessorError {
 *   error: string
 *   code?: string
 *   detail?: any
 * }
 * ```
 *
 * While implementing the Payment Processor's methods, if you need to inform the Medusa core that an error occurred at a certain stage,
 * return an object having the attributes defined in the `PaymentProcessorError` interface.
 *
 * For example, the Stripe payment processor has the following method to create the error object, which is used within other methods:
 *
 * ```ts
 * abstract class StripeBase extends AbstractPaymentProcessor {
 *   // ...
 *   protected buildError(
 *     message: string,
 *     e: Stripe.StripeRawError | PaymentProcessorError | Error
 *   ): PaymentProcessorError {
 *     return {
 *       error: message,
 *       code: "code" in e ? e.code : "",
 *       detail: isPaymentProcessorError(e)
 *         ? `${e.error}${EOL}${e.detail ?? ""}`
 *         : "detail" in e
 *         ? e.detail
 *         : e.message ?? "",
 *     }
 *   }
 *
 *   // used in other methods
 *   async retrievePayment(
 *     paymentSessionData: Record<string, unknown>
 *   ): Promise<
 *     PaymentProcessorError |
 *     PaymentProcessorSessionResponse["session_data"]
 *   > {
 *     try {
 *       // ...
 *     } catch (e) {
 *       return this.buildError(
 *         "An error occurred in retrievePayment",
 *         e
 *       )
 *     }
 *   }
 * }
 * ```
 *
 * ---
 *
 */
export interface PaymentProcessor {
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
   *
   * @example
   * import {
   *   PaymentContext,
   *   PaymentSessionResponse,
   *   // ...
   * } from "@medusajs/medusa"
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async initiatePayment(
   *     context: PaymentProcessorContext
   *   ): Promise<
   *     PaymentProcessorError | PaymentProcessorSessionResponse
   *   > {
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const clientPayment = await this.client.initiate(context)
   *
   *     return {
   *       session_data: {
   *         id: clientPayment.id
   *       },
   *     }
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorContext,
   *   PaymentProcessorError,
   *   PaymentProcessorSessionResponse,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async updatePayment(
   *     context: PaymentProcessorContext
   *   ): Promise<
   *     void |
   *     PaymentProcessorError |
   *     PaymentProcessorSessionResponse
   *   > {
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const paymentId = context.paymentSessionData.id
   *
   *     await this.client.update(paymentId, context)
   *
   *     return {
   *       session_data: context.paymentSessionData
   *     }
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async refundPayment(
   *     paymentSessionData: Record<string, unknown>,
   *     refundAmount: number
   *   ): Promise<Record<string, unknown> | PaymentProcessorError> {
   *     const paymentId = paymentSessionData.id
   *
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const refundData = this.client.refund(paymentId, refundAmount)
   *
   *     return {
   *       id: paymentId,
   *       ...refundData
   *     }
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   PaymentSessionStatus,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async authorizePayment(
   *     paymentSessionData: Record<string, unknown>,
   *     context: Record<string, unknown>
   *   ): Promise<
   *     PaymentProcessorError |
   *     {
   *       status: PaymentSessionStatus;
   *       data: Record<string, unknown>;
   *     }
   *   > {
   *     try {
   *       await this.client.authorize(paymentSessionData.id)
   *
   *       return {
   *         status: PaymentSessionStatus.AUTHORIZED,
   *         data: {
   *           id: paymentSessionData.id
   *         }
   *       }
   *     } catch (e) {
   *       return {
   *         error: e.message
   *       }
   *     }
   *   }
   * }
   */
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        /**
         * The status of the payment, which will be stored in the payment session's `status` field.
         */
        status: PaymentSessionStatus
        /**
         * The `data` to be stored in the payment session's `data` field.
         */
        data: PaymentProcessorSessionResponse["session_data"]
      }
  >

  /**
   * This method is used to capture the payment amount of an order. This is typically triggered manually by the store operator from the admin.
   *
   * This method is also used for capturing payments of a swap of an order, or when a request is sent to the [Capture Payment API Route](https://docs.medusajs.com/api/admin#payments_postpaymentspaymentcapture).
   *
   * You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.
   *
   * @param {Record<string, unknown>} paymentSessionData - The `data` field of the Payment for its first parameter.
   * @returns Either an error object or a value that's stored in the `data` field of the Payment.
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async capturePayment(
   *     paymentSessionData: Record<string, unknown>
   *   ): Promise<Record<string, unknown> | PaymentProcessorError> {
   *     const paymentId = paymentSessionData.id
   *
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const captureData = this.client.catch(paymentId)
   *
   *     return {
   *       id: paymentId,
   *       ...captureData
   *     }
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async deletePayment(
   *     paymentSessionData: Record<string, unknown>
   *   ): Promise<Record<string, unknown> | PaymentProcessorError> {
   *     const paymentId = paymentSessionData.id
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     this.client.delete(paymentId)
   *
   *     return {}
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async retrievePayment(
   *     paymentSessionData: Record<string, unknown>
   *   ): Promise<Record<string, unknown> | PaymentProcessorError> {
   *     const paymentId = paymentSessionData.id
   *
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     return await this.client.retrieve(paymentId)
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async cancelPayment(
   *     paymentSessionData: Record<string, unknown>
   *   ): Promise<Record<string, unknown> | PaymentProcessorError> {
   *     const paymentId = paymentSessionData.id
   *
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const cancelData = this.client.cancel(paymentId)
   *
   *     return {
   *       id: paymentId,
   *       ...cancelData
   *     }
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentSessionStatus
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   async getPaymentStatus(
   *     paymentSessionData: Record<string, unknown>
   *   ): Promise<PaymentSessionStatus> {
   *     const paymentId = paymentSessionData.id
   *
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     return await this.client.getStatus(paymentId) as PaymentSessionStatus
   *   }
   * }
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
   *
   * @example
   * import {
   *   PaymentProcessorError,
   *   PaymentProviderService,
   *   // ...
   * } from "@medusajs/medusa"
   * // ...
   *
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   protected paymentProviderService: PaymentProviderService
   *   // ...
   *   constructor(container, options) {
   *     super(container)
   *     this.paymentProviderService = container.paymentProviderService
   *     // ...
   *   }
   *   // ...
   *   async updatePaymentData(
   *     sessionId: string,
   *     data: Record<string, unknown>
   *   ): Promise<
   *     Record<string, unknown> |
   *     PaymentProcessorError
   *   > {
   *     const paymentSession = await this.paymentProviderService.retrieveSession(sessionId)
   *     // assuming client is an initialized client
   *     // communicating with a third-party service.
   *     const clientPayment = await this.client.update(paymentSession.data.id, data)
   *
   *     return {
   *       id: clientPayment.id
   *     }
   *   }
   * }
   */
  updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >
}

export abstract class AbstractPaymentProcessor implements PaymentProcessor {
  /**
   * You can use the `constructor` of your Payment Processor to have access to different services in Medusa through [dependency injection](https://docs.medusajs.com/development/fundamentals/dependency-injection).
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
   * you can initialize it in the constructor and use it in other methods in the service.
   *
   * Additionally, if you’re creating your Payment Processor as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin,
   * you can access it in the constructor. The options are passed as a second parameter.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend through [dependency injection](https://docs.medusajs.com/development/fundamentals/dependency-injection)
   * @param {Record<string, unknown>} config - If this payment processor is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * ```ts
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   // ...
   *   constructor(container, options) {
   *     super(container)
   *     // you can access options here
   *
   *     // you can also initialize a client that
   *     // communicates with a third-party service.
   *     this.client = new Client(options)
   *   }
   *   // ...
   * }
   * ```
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  /**
   * @ignore
   */
  static _isPaymentProcessor = true

  /**
   * @ignore
   */
  static isPaymentProcessor(object): boolean {
    return object?.constructor?._isPaymentProcessor
  }

  /**
   * The `PaymentProvider` entity has 2 properties: `id` and `is_installed`. The `identifier` property in the payment processor service is used when the payment processor is added to the database.
   *
   * The value of this property is also used to reference the payment processor throughout Medusa.
   * For example, it is used to [add a payment processor](https://docs.medusajs.com/api/admin#regions_postregionsregionpaymentproviders) to a region.
   *
   * ```ts
   * class MyPaymentService extends AbstractPaymentProcessor {
   *   static identifier = "my-payment"
   *   // ...
   * }
   * ```
   */
  public static identifier: string

  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment plugin provider
   */
  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractPaymentProcessor

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  abstract capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus
        data: PaymentProcessorSessionResponse["session_data"]
      }
  >

  abstract cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  abstract deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  abstract refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void>

  abstract updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >
}

export function isPaymentProcessorError(
  obj: any
): obj is PaymentProcessorError {
  return obj && typeof obj === "object" && obj.error && obj.code && obj.detail
}
