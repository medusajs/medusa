import {
  IPaymentProvider,
  ProviderWebhookPayload,
  WebhookActionResult,
  CapturePaymentInput,
  CapturePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
} from "@medusajs/types"

export abstract class AbstractPaymentProvider<TConfig = Record<string, unknown>>
  implements IPaymentProvider
{
  /**
   * @ignore
   */
  protected readonly container: Record<string, unknown>
  /**
   * This method validates the options of the provider set in `medusa-config.ts`.
   * Implementing this method is optional, but it's useful to ensure that the required
   * options are passed to the provider, or if you have any custom validation logic.
   *
   * If the options aren't valid, throw an error.
   *
   * @param options - The provider's options passed in `medusa-config.ts`.
   *
   * @example
   * class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
   *   static validateOptions(options: Record<any, any>) {
   *     if (!options.apiKey) {
   *       throw new MedusaError(
   *         MedusaError.Types.INVALID_DATA,
   *         "API key is required in the provider's options."
   *       )
   *     }
   *   }
   * }
   */
  static validateOptions(options: Record<any, any>): void | never {}

  /**
   * The constructor allows you to access resources from the [module's container](https://docs.medusajs.com/learn/fundamentals/modules/container)
   * using the first parameter, and the module's options using the second parameter.
   * 
   * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
   *
   * :::note
   *
   * A module's options are passed when you register it in the Medusa application.
   *
   * :::
   *
   * @param {Record<string, unknown>} cradle - The module's container used to resolve resources.
   * @param {Record<string, unknown>} config - The options passed to the Payment Module provider.
   * @typeParam TConfig - The type of the provider's options passed as a second parameter.
   *
   * @example
   * import { AbstractPaymentProvider } from "@medusajs/framework/utils"
   * import { Logger } from "@medusajs/framework/types"
   *
   * type Options = {
   *   apiKey: string
   * }
   *
   * type InjectedDependencies = {
   *   logger: Logger
   * }
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
   *   protected logger_: Logger
   *   protected options_: Options
   *   // assuming you're initializing a client
   *   protected client
   *
   *   constructor(
   *     container: InjectedDependencies,
   *     options: Options
   *   ) {
   *     super(container, options)
   *
   *     this.logger_ = container.logger
   *     this.options_ = options
   *
   *     // TODO initialize your client
   *   }
   *   // ...
   * }
   *
   * export default MyPaymentProviderService
   */
  protected constructor(
    cradle: Record<string, unknown>,
    /**
     * @ignore
     */
    protected readonly config: TConfig = {} as TConfig // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    this.container = cradle
  }

  /**
   * @ignore
   */
  static _isPaymentProvider = true

  /**
   * @ignore
   */
  static isPaymentProvider(object): boolean {
    return object?.constructor?._isPaymentProvider
  }

  /**
   * Each payment provider has a unique identifier defined in its class. The provider's ID
   * will be stored as `pp_{identifier}_{id}`, where `{id}` is the provider's `id`
   * property in the `medusa-config.ts`.
   *
   * @example
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   static identifier = "my-payment"
   *   // ...
   * }
   */
  public static identifier: string

  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment plugin provider
   */
  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractPaymentProvider

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  /**
   * This method captures a payment using the third-party provider. In this method, use the third-party provider to capture the payment.
   * 
   * When an order is placed, the payment is authorized using the {@link authorizePayment} method. Then, the admin
   * user can capture the payment, which triggers this method.
   * 
   * ![Diagram showcasing capture payment flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1747307414/Medusa%20Resources/Klarna_Payment_Graphic_2025_1_lii7bw.jpg)
   * 
   * This method can also be triggered by a webhook event if the {@link getWebhookActionAndData} method returns the action `captured`.
   * 
   * #### Understanding `data` property
   * 
   * The `data` property of the input parameter contains data that was previously stored in the Payment record's `data` property, which was
   * returned by the {@link authorizePayment} method.
   * 
   * The `data` property returned by this method is then stored in the `Payment` record. You can store data relevant to later refund or process the payment.
   * For example, you can store the ID of the payment in the third-party provider to reference it later.
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747309870/Medusa%20Resources/capture-data_acgdhf.jpg)
   *
   * @param input - The input to capture the payment. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The new data to store in the payment's `data` property. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   CapturePaymentInput,
   *   CapturePaymentOutput,
   * } from "@medusajs/framework/types"
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async capturePayment(
   *     input: CapturePaymentInput
   *   ): Promise<CapturePaymentOutput> {
   *     const externalId = input.data?.id
   *
   *       // assuming you have a client that captures the payment
   *     const newData = await this.client.capturePayment(externalId)
   *     return {
   *       data: {
   *         ...newData,
   *         id: externalId,
   *       }
   *     }
   *   }
   *   // ...
   * }
   */
  abstract capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput>

  /**
   * This method authorizes a payment session using the third-party payment provider.
   * 
   * During checkout, the customer may need to perform actions required by the payment provider,
   * such as entering their card details or confirming the payment. Once that is done,
   * the customer can place their order.
   * 
   * During cart-completion before placing the order, this method is used to authorize the cart's payment session with the 
   * third-party payment provider. The payment can later be captured
   * using the {@link capturePayment} method.
   * 
   * ![Diagram showcasing authorize payment flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1747307795/Medusa%20Resources/authorize-payment_qzpy6e.jpg)
   * 
   * When authorized successfully, a `Payment` is created by the Payment
   * Module, and it's associated with the order.
   * 
   * #### Understanding `data` property
   * 
   * The `data` property of the method's parameter contains the `PaymentSession` record's `data` property, which was
   * returned by the {@link initiatePayment} method.
   * 
   * The `data` property returned by this method is then stored in the created `Payment` record. You can store data relevant to later capture or process the payment.
   * For example, you can store the ID of the payment in the third-party provider to reference it later.
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747309278/Medusa%20Resources/authorize-data_erjg7r.jpg)
   *
   * @param input - The input to authorize the payment. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The status of the authorization, along with the `data` field about the payment. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   AuthorizePaymentInput,
   *   AuthorizePaymentOutput,
   *   PaymentSessionStatus
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async authorizePayment(
   *     input: AuthorizePaymentInput
   *   ): Promise<AuthorizePaymentOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that authorizes the payment
   *     const paymentData = await this.client.authorizePayment(externalId)
   *
   *     return {
   *       data: paymentData,
   *       status: "authorized"
   *     }
   *   }
   *
   *   // ...
   * }
   */
  abstract authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput>

  /**
   * This method cancels a payment in the third-party payment provider. It's used when
   * the admin user cancels an order. The order can only be canceled if the payment
   * is not captured yet.
   * 
   * #### Understanding `data` property
   * 
   * The `data` property of the method's parameter contains the `Payment` record's `data` property, which was
   * returned by the {@link authorizePayment} method.
   * 
   * The `data` property returned by this method is then stored in the `Payment` record. You can store data relevant for any further processing of the payment.
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747310189/Medusa%20Resources/cancel-data_gzcgbc.jpg)
   *
   * @param input - The input to cancel the payment. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The new data to store in the payment's `data` property, if any. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   PaymentProviderError,
   *   PaymentProviderSessionResponse,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async cancelPayment(
   *     input: CancelPaymentInput
   *   ): Promise<CancelPaymentOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that cancels the payment
   *     const paymentData = await this.client.cancelPayment(externalId)
   *     return { data: paymentData }
   *   }
   *
   *   // ...
   * }
   */
  abstract cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput>

  /**
   * This method initializes a payment session with the third-party payment provider.
   * 
   * When a customer chooses a payment method during checkout, this method is triggered to
   * perform any initialization action with the third-party provider, such as creating a payment session.
   * 
   * ![Diagram showcasing initiate payment flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1747310624/Medusa%20Resources/initiate-payment_dpoa2g.jpg)
   * 
   * #### Understanding `data` property
   * 
   * The `data` property returned by this method will be stored in the created `PaymentSession` record. You can store data relevant to later authorize or process the payment.
   * For example, you can store the ID of the payment session in the third-party provider to reference it later.
   * 
   * The `data` property is also available to storefronts, allowing you to store data necessary for the storefront to integrate
   * the payment provider in the checkout flow. For example, you can store the client token to use with the payment provider's SDK.
   * 
   * :::note
   * 
   * This also means you shouldn't store sensitive data and tokens in the `data` property, as it's publicly accessible.
   * 
   * :::
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747310699/Medusa%20Resources/initiate-data_ikc05t.jpg)
   *
   * @param input - The input to create the payment session.
   * @returns The new data to store in the payment's `data` property. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   InitiatePaymentInput,
   *   InitiatePaymentOutput,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async initiatePayment(
   *     input: InitiatePaymentInput
   *   ): Promise<InitiatePaymentOutput> {
   *     const {
   *       amount,
   *       currency_code,
   *       context: customerDetails
   *     } = input
   *
   *     // assuming you have a client that initializes the payment
   *     const response = await this.client.init(
   *       amount, currency_code, customerDetails
   *     )
   *
   *     return {
   *       id: response.id,
   *       data: response,
   *     }
   *   }
   *
   *   // ...
   * }
   */
  abstract initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput>

  /**
   * This method deletes a payment session in the third-party payment provider.
   * 
   * When a customer chooses a payment method during checkout, then chooses a different one,
   * this method is triggered to delete the previous payment session.
   * 
   * If your provider doesn't support deleting a payment session, you can just return an empty object or
   * an object that contains the same received `data` property.
   * 
   * ![Diagram showcasing delete payment flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1747311084/Medusa%20Resources/delete-payment_smxsiq.jpg)
   * 
   * #### Understanding `data` property
   * 
   * The `data` property of the method's parameter contains the `PaymentSession` record's `data` property, which was
   * returned by the {@link initiatePayment} method.
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747311084/Medusa%20Resources/delete-data_xg65ck.jpg)
   *
   * @param input - The input to delete the payment session. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The new data to store in the payment's `data` property, if any. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   DeletePaymentInput,
   *   DeletePaymentOutput,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async deletePayment(
   *     input: DeletePaymentInput
   *   ): Promise<DeletePaymentOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that cancels the payment
   *     await this.client.cancelPayment(externalId)
   *     return {
   *       data: input.data
   *     }
   *   }
   *
   *   // ...
   * }
   */
  abstract deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput>

  /**
   * This method gets the status of a payment session based on the status in the third-party integration.
   *
   * @param input - The input to get the payment status. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The payment session's status. It can also return additional `data` from the payment provider.
   *
   * @example
   * // other imports...
   * import {
   *   GetPaymentStatusInput,
   *   GetPaymentStatusOutput,
   *   PaymentSessionStatus
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async getPaymentStatus(
   *     input: GetPaymentStatusInput
   *   ): Promise<GetPaymentStatusOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that retrieves the payment status
   *     const status = await this.client.getStatus(externalId)
   *
   *     switch (status) {
   *       case "requires_capture":
   *           return {status: "authorized"}
   *         case "success":
   *           return {status: "captured"}
   *         case "canceled":
   *           return {status: "canceled"}
   *         default:
   *           return {status: "pending"}
   *      }
   *   }
   *
   *   // ...
   * }
   */
  abstract getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput>

  /**
   * This method refunds an amount using the third-party payment provider. This method
   * is triggered when the admin user refunds a payment of an order.
   * 
   * #### Understanding `data` property
   * 
   * The `data` property of the method's parameter contains the `Payment` record's `data` property, which was
   * returned by the {@link capturePayment} or {@link refundPayment} method.
   * 
   * The `data` property returned by this method is then stored in the `Payment` record. You can store data relevant to later refund or process the payment.
   * For example, you can store the ID of the payment in the third-party provider to reference it later.
   * 
   * :::note
   * 
   * A payment may be refunded multiple times with different amounts. In this case, the `data` property
   * of the input parameter contains the data from the last refund.
   * 
   * :::
   * 
   * ![Diagram showcasing data flow between methods](https://res.cloudinary.com/dza7lstvk/image/upload/v1747311296/Medusa%20Resources/refund-data_plcjl0.jpg)
   *
   * @param input - The input to refund the payment. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The new data to store in the payment's `data` property, or an error object.
   *
   * @example
   * // other imports...
   * import {
   *   RefundPaymentInput,
   *   RefundPaymentOutput,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async refundPayment(
   *     input: RefundPaymentInput
   *   ): Promise<RefundPaymentOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that refunds the payment
   *     const newData = await this.client.refund(
   *         externalId,
   *         input.amount
   *       )
   *
   *     return {
   *       data: input.data,
   *     }
   *   }
   *   // ...
   * }
   */
  abstract refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput>

  /**
   * This method retrieves the payment's data from the third-party payment provider.
   *
   * @param input - The input to retrieve the payment. The `data` field should contain the data from the payment provider when the payment was created.
   * @returns The payment's data as found in the payment provider.
   *
   * @example
   * // other imports...
   * import {
   *   RetrievePaymentInput,
   *   RetrievePaymentOutput,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async retrievePayment(
   *     input: RetrievePaymentInput
   *   ): Promise<RetrievePaymentOutput> {
   *     const externalId = input.data?.id
   *
   *     // assuming you have a client that retrieves the payment
   *     return await this.client.retrieve(externalId)
   *   }
   *   // ...
   * }
   */
  abstract retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput>

  /**
   * This method updates a payment in the third-party service that was previously initiated with the {@link initiatePayment} method.
   *
   * @param input - The input to update the payment. The `data` field should contain the data from the payment provider. when the payment was created.
   * @returns The new data to store in the payment's `data` property. Throws in case of an error.
   *
   * @example
   * // other imports...
   * import {
   *   UpdatePaymentInput,
   *   UpdatePaymentOutput,
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async updatePayment(
   *     input: UpdatePaymentInput
   *   ): Promise<UpdatePaymentOutput> {
   *     const { amount, currency_code, context } = input
   *     const externalId = input.data?.id
   * 
   *     // Validate context.customer
   *     if (!context || !context.customer) {
   *       throw new Error("Context must include a valid customer.");
   *     }
   *
   *     // assuming you have a client that updates the payment
   *     const response = await this.client.update(
   *       externalId,
   *         {
   *           amount,
   *           currency_code,
   *           customer: context.customer
   *         }
   *       )
   *
   *     return response
   *   }
   *
   *   // ...
   * }
   */
  abstract updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput>

  /**
   * This method is executed when a webhook event is received from the third-party payment provider. Medusa uses
   * the data returned by this method to perform actions in the Medusa application, such as completing the associated cart
   * if the payment was authorized successfully.
   *
   * Learn more in the [Webhook Events](https://docs.medusajs.com/resources/commerce-modules/payment/webhook-events) documentation.
   *
   * @param data - The webhook event's data
   * @returns The webhook result. If the `action`'s value is `captured`, the payment is captured within Medusa as well.
   * If the `action`'s value is `authorized`, the associated payment session is authorized within Medusa and the associated cart
   * will be completed to create an order.
   *
   * @example
   * // other imports...
   * import {
   *   BigNumber
   * } from "@medusajs/framework/utils"
   * import {
   *   ProviderWebhookPayload,
   *   WebhookActionResult
   * } from "@medusajs/framework/types"
   *
   *
   * class MyPaymentProviderService extends AbstractPaymentProvider<
   *   Options
   * > {
   *   async getWebhookActionAndData(
   *     payload: ProviderWebhookPayload["payload"]
   *   ): Promise<WebhookActionResult> {
   *     const {
   *       data,
   *       rawData,
   *       headers
   *     } = payload
   *
   *     try {
   *       switch(data.event_type) {
   *         case "authorized_amount":
   *           return {
   *             action: "authorized",
   *             data: {
   *               // assuming the session_id is stored in the metadata of the payment
   *               // in the third-party provider
   *               session_id: (data.metadata as Record<string, any>).session_id,
   *               amount: new BigNumber(data.amount as number)
   *             }
   *           }
   *         case "success":
   *           return {
   *             action: "captured",
   *             data: {
   *               // assuming the session_id is stored in the metadata of the payment
   *               // in the third-party provider
   *               session_id: (data.metadata as Record<string, any>).session_id,
   *               amount: new BigNumber(data.amount as number)
   *             }
   *           }
   *         default:
   *           return {
   *             action: "not_supported",
   *             data: {
   *               session_id: "",
   *               amount: new BigNumber(0)
   *             }
   *           }
   *       }
   *     } catch (e) {
   *       return {
   *         action: "failed",
   *         data: {
   *           // assuming the session_id is stored in the metadata of the payment
   *           // in the third-party provider
   *           session_id: (data.metadata as Record<string, any>).session_id,
   *           amount: new BigNumber(data.amount as number)
   *         }
   *       }
   *     }
   *   }
   *
   *   // ...
   * }
   */
  abstract getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult>
}
