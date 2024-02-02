import {
    AuthProviderScope,
    PaymentProcessorContext,
    PaymentProcessorError,
    PaymentProcessorSessionResponse,
} from "@medusajs/types"
import { PaymentSessionStatus } from "./payment-session"

export abstract class AbstractPaymentModuleProvider {
  //   public static PROVIDER: string
  //   public static DISPLAY_NAME: string
  protected readonly installations_: Record<string, AuthProviderScope>

  public get provider() {
    return (this.constructor as Function & { PROVIDER: string }).PROVIDER
  }

  public get displayName() {
    return (this.constructor as Function & { DISPLAY_NAME: string })
      .DISPLAY_NAME
  }

  protected constructor({ installations }) {
    this.installations_ = installations
  }

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
  public static PROVIDER: string
  public static DISPLAY_NAME: string

  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the payment plugin provider
   */
  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractPaymentModuleProvider

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
