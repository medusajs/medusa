import { Address, Customer, PaymentSessionStatus } from "../models"
import { MedusaContainer } from "../types/global"

export type PaymentProcessorContext = {
  billing_address?: Address | null
  email: string
  currency_code: string
  amount: number
  resource_id?: string
  customer?: Customer
  context: Record<string, unknown>
}

export type PaymentProcessorSessionResponse = {
  update_requests: { customer_metadata: Record<string, unknown> }
  session_data: Record<string, unknown>
}

export interface PaymentProcessorError {
  error: string
  code: number
  details: any
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
   * Used to initialise anything like an SDK or similar
   */
  init(): Promise<void>

  /**
   * Initiate a payment session with the external provider
   */
  initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  /**
   * Update an existing payment session
   * @param paymentId
   * @param context
   */
  updatePayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Refund an existing session
   * @param paymentId
   * @param context
   */
  refundPayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Authorize an existing session if it is not already authorized
   * @param paymentId
   * @param context
   */
  authorizePayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Capture an existing session
   * @param paymentId
   * @param context
   */
  capturePayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  /**
   * Delete an existing session
   * @param paymentId
   */
  deletePayment(paymentId: string): Promise<PaymentProcessorError | void>

  /**
   * Retrieve an existing session
   * @param paymentId
   */
  retrievePayment(
    paymentId: string
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  /**
   * Cancel an existing session
   * @param paymentId
   */
  cancelPayment(paymentId: string): Promise<PaymentProcessorError | void>

  /**
   * Return the status of the session
   * @param paymentId
   */
  getPaymentStatus(paymentId: string): Promise<PaymentSessionStatus>

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
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract authorizePayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract cancelPayment(
    paymentId: string
  ): Promise<PaymentProcessorError | void>

  abstract initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse>

  abstract deletePayment(
    paymentId: string
  ): Promise<PaymentProcessorError | void>

  abstract getSavedMethods(
    customer: Customer
  ): Promise<Record<string, unknown>[]>

  abstract getPaymentStatus(paymentId: string): Promise<PaymentSessionStatus>

  abstract refundPayment(
    paymentId: string,
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | void>

  abstract retrievePayment(
    paymentId: string
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  >

  abstract updatePayment(
    paymentId: string,
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
