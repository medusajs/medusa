import {
  IPaymentProcessor,
  MedusaContainer,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/types"

export abstract class AbstractPaymentProcessor implements IPaymentProcessor {
  /**
   * You can use the `constructor` of your Payment Processor to have access to different services in Medusa through [dependency injection](https://docs.medusajs.com/development/fundamentals/dependency-injection).
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
   * you can initialize it in the constructor and use it in other methods in the service.
   *
   * Additionally, if you’re creating your Payment Processor as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin,
   * you can access it in the constructor. The options are passed as a second parameter.
   *
   * @param {MedusaContainer} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend through [dependency injection](https://docs.medusajs.com/development/fundamentals/dependency-injection)
   * @param {Record<string, unknown>} config - If this fulfillment provider is created in a plugin, the plugin's options are passed in this parameter.
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
    protected readonly container: MedusaContainer,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  static _isPaymentProcessor = true

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
