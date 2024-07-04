import {
  CreatePaymentProviderSession,
  IPaymentProvider,
  MedusaContainer,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult
} from "@medusajs/types"

/**
 * ## Overview
 *
 * A payment provider is used to handle and process payments, such as authorizing, capturing, and refund payments.
 * 
 * ---
 * 
 * ## How to Create a Payment Provider
 * 
 * A payment provider is a TypeScript or JavaScript class that extends the `AbstractPaymentProvider` class imported from `@medusajsa/utils`.
 * 
 * You can create the payment provider in a module or plugin, then pass that module/plugin in the Payment Module's `providers` option. You can also pass the path to the file
 * that defines the provider if it's created in the Medusa application's codebase.
 * 
 * For example:
 * 
 * ```ts
 * abstract class MyPayment extends AbstractPaymentProvider<MyConfigurations> {
 *   // ...
 * }
 * ```
 *
 * ---
 * 
 * ## Configuration Type Parameter
 * 
 * The `AbstractPaymentProvider` class accepts an optional type parameter that defines the type of configuration that your payment provider expects.
 * 
 * For example:
 * 
 * ```ts
 * interface MyConfigurations {
 *   apiKey: string
 * }
 * 
 * abstract class MyPayment extends AbstractPaymentProvider<MyConfigurations> {
 *   // ...
 * }
 * ```
 * 
 * ---
 *
 * ## Identifier Property
 *
 * The `PaymentProvider` data model has 2 properties: `id` and `is_enabled`.
 *
 * ```ts
 * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
 *   static identifier = "my-payment"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## PROVIDER Property
 *
 * The `PROVIDER` static property is used when registering the provider in the module's container. Typically, it would have the
 * same value as the `identifier` property.
 *
 * ```ts
 * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
 *   static PROVIDER = "my-payment"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## PaymentProviderError
 *
 * Before diving into the methods of the Payment Provider, you'll notice that part of the expected return signature of these method includes `PaymentProviderError`.
 *
 * ```ts
 * interface PaymentProviderError {
 *   error: string
 *   code?: string
 *   detail?: any
 * }
 * ```
 *
 * While implementing the Payment Provider's methods, if you need to inform the Payment Module that an error occurred at a certain stage,
 * return an object having the attributes defined in the `PaymentProviderError` interface.
 *
 * For example, the Stripe payment provider has the following method to create the error object, which is used within other methods:
 *
 * ```ts
 * abstract class StripeBase extends AbstractPaymentProvider {
 *   // ...
 *   protected buildError(
 *    message: string,
 *    error: Stripe.StripeRawError | PaymentProviderError | Error
 *  ): PaymentProviderError {
 *    return {
 *      error: message,
 *      code: "code" in error ? error.code : "unknown",
 *      detail: isPaymentProviderError(error)
 *        ? `${error.error}${EOL}${error.detail ?? ""}`
 *        : "detail" in error
 *        ? error.detail
 *        : error.message ?? "",
 *    }
 *  }
 *
 *   // used in other methods
 *   async retrievePayment(
 *     paymentSessionData: Record<string, unknown>
 *   ): Promise<
 *     PaymentProviderError |
 *     PaymentProviderSessionResponse["session_data"]
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
 */
export abstract class AbstractPaymentProvider<TConfig = Record<string, unknown>>
  implements IPaymentProvider
{
  /**
   * You can use the `constructor` of your payment provider to have access to resources in your application through the module's container.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
   * you can initialize it in the constructor and use it in other methods in the service.
   *
   * The payment provider also can access the configurations of the module or plugin it's created in as a second parameter.
   *
   * @param {MedusaContainer} container - An instance of `MedusaContainer` that allows you to access other resources in the module's container.
   * @param {Record<string, unknown>} config - If this provider processor is created in a module or plugin, their options are passed in this parameter.
   *
   * @example
   * ```ts
   * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
   *   // ...
   *   constructor(container, config) {
   *     super(container, config)
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
    protected readonly container: MedusaContainer,
    protected readonly config: TConfig = {} as TConfig // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

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
   * The `PaymentProvider` data model has 2 properties: `id` and `is_enabled`.
   *
   * ```ts
   * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
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
    const ctr = this.constructor as typeof AbstractPaymentProvider

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  abstract capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  abstract authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | {
        status: PaymentSessionStatus
        data: PaymentProviderSessionResponse["data"]
      }
  >

  abstract cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  abstract initiatePayment(
    context: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  abstract deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  abstract getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>

  abstract refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  abstract retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]>

  abstract updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse>

  abstract getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult>
}

/**
 * @ignore
 */
export function isPaymentProviderError(obj: any): obj is PaymentProviderError {
  return (
    obj &&
    typeof obj === "object" &&
    "error" in obj &&
    "code" in obj &&
    "detail" in obj
  )
}
