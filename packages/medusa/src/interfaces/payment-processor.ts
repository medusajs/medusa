import { Address, Customer, PaymentSessionStatus } from "../models"
import { MedusaContainer } from "../types/global"

export type PaymentProcessorContext = {
  billing_address?: Address | null
  email: string
  currency_code: string
  amount: number
  resource_id: string
  customer?: Customer
  context: Record<string, unknown>
  paymentSessionData: Record<string, unknown>
}

export type PaymentProcessorSessionResponse = {
  update_requests?: { customer_metadata?: Record<string, unknown> }
  session_data: Record<string, unknown>
}

export interface PaymentProcessorError {
  error: string
  code?: string
  detail?: any
}

/**
 * The new payment service plugin interface
 * This work is still experimental and can be changed until it becomes stable
 */
export interface PaymentProcessor {
  /**
   * Return a unique identifier to retrieve the payment plugin provider
   */
  getIdentifier(): string

  /**
   * Initiate a payment session with the external provider
   */
  initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  /**
   * Update an existing payment session
   * @param context
   */
  updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void>

  /**
   * Refund an existing session
   * @param paymentSessionData
   * @param refundAmount
   */
  refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Authorize an existing session if it is not already authorized
   * @param paymentSessionData
   * @param context
   */
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus
        data: PaymentProcessorSessionResponse["session_data"]
      }
  >

  /**
   * Capture an existing session
   * @param paymentSessionData
   */
  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Delete an existing session
   */
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Retrieve an existing session
   */
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Cancel an existing session
   */
  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Return the status of the session
   */
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus>
}

/**
 * Payment processor in charge of creating , managing and processing a payment
 */
export abstract class AbstractPaymentProcessor implements PaymentProcessor {
  protected constructor(
    protected readonly container: MedusaContainer,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  public static identifier: string

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
}

/**
 * Return if the input object is AbstractPaymentProcessor
 * @param obj
 */
export function isPaymentProcessor(obj: unknown): boolean {
  return obj instanceof AbstractPaymentProcessor
}

/**
 * Utility function to determine if an object is a processor error
 * @param obj
 */
export function isPaymentProcessorError(
  obj: any
): obj is PaymentProcessorError {
  return obj && typeof obj === "object" && (obj.error || obj.code || obj.detail)
}
