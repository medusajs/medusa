import { Customer, PaymentSessionStatus } from "../models"
import { MedusaContainer } from "../types/global"
import {
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
} from "../types/payment-processor"

/**
 * The new payment service plugin interface
 */
export interface PaymentProcessor {
  /**
   * Return a unique identifier to retrieve the payment plugin provider
   */
  getIdentifier(): string

  /**
   * This method will be called once when the plugin will be registered
   */
  init(): Promise<void>

  /**
   * Initiate a payment session with the external provider
   */
  createPayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  /**
   * Update an existing payment session
   * @param sessionId
   * @param context
   */
  updatePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Refund an existing session
   * @param sessionId
   * @param context
   */
  refundPayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Authorize an existing session if it is not already authorized
   * @param sessionId
   * @param context
   */
  authorizePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Capture an existing session
   * @param sessionId
   * @param context
   */
  capturePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Delete an existing session
   * @param sessionId
   */
  deletePayment(sessionId: string): Promise<PaymentProcessorError | void>

  /**
   * Retrieve an existing session
   * @param sessionId
   */
  retrievePayment(
    sessionId: string
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Cancel an existing session
   * @param sessionId
   */
  cancelPayment(sessionId: string): Promise<PaymentProcessorError | void>

  /**
   * Return the status of the session
   * @param sessionId
   */
  getPaymentStatus(sessionId: string): Promise<PaymentSessionStatus>

  /**
   * An optional method to implement in order to retrieve the methods saved for a customer in case the provider
   * provide such feature. It is based on the collected data that have been given by the plugin
   * and saved on the customer
   *
   * @example
   * getSavedMethods(
   *   customer: Customer
   * ): Promise<Record<string, unknown>[]> {
   *  if (customer.metadata?.stripe_id) {
   *    const methods = await this.stripe_.paymentMethods.list({
   *      customer: customer.metadata.stripe_id
   *      type: "card",
   *    })
   *
   *    return methods.data
   *  }
   *
   *  return []
   * }
   *
   * @param customer
   */
  getSavedMethods(customer: Customer): Promise<Record<string, unknown>[]>
}

/**
 * Payment processor in charge of creating , managing and processing a payment
 */
export abstract class AbstractPaymentProcessor implements PaymentProcessor {
  protected constructor(
    protected readonly container: MedusaContainer,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  protected static identifier: string

  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractPaymentProcessor

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  abstract init(): Promise<void>

  abstract capturePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract authorizePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract cancelPayment(
    sessionId: string
  ): Promise<PaymentProcessorError | void>

  abstract createPayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  abstract deletePayment(
    sessionId: string
  ): Promise<PaymentProcessorError | void>

  abstract getSavedMethods(
    customer: Customer
  ): Promise<Record<string, unknown>[]>

  abstract getPaymentStatus(sessionId: string): Promise<PaymentSessionStatus>

  abstract refundPayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract retrievePayment(
    sessionId: string
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract updatePayment(
    sessionId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>
}

/**
 * Return if the input object is AbstractPaymentProcessor
 * @param obj
 */
export function isPaymentProcessor(obj: unknown): boolean {
  return obj instanceof AbstractPaymentProcessor
}
