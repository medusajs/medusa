import { TransactionBaseService } from "./transaction-base-service"
import {
  Cart,
  Customer,
  Payment,
  PaymentSession,
  PaymentSessionStatus,
} from "../models"
import { PaymentService } from "medusa-interfaces"
import { PaymentProviderDataInput } from "../types/payment-collection"
import {
  PaymentContext,
  PaymentPluginError,
  PaymentSessionResponse,
} from "../types/payment"
import { MedusaContainer } from "../types/global"

export type Data = Record<string, unknown>
export type PaymentData = Data
export type PaymentSessionData = Data

/**
 * @deprecated use the new PaymentServicePlugin interface instead
 * The old payment service plugin interface
 */
export interface PaymentService extends TransactionBaseService {
  getIdentifier(): string

  /**
   * @deprecated use PaymentServicePlugin.retrieve instead
   * @param paymentSession
   */
  getPaymentData(paymentSession: PaymentSession): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.update instead
   * @param paymentSessionData
   * @param data
   */
  updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.create instead
   * @param cart
   */
  createPayment(cart: Cart): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.retrieve instead
   * @param paymentData
   */
  retrievePayment(paymentData: PaymentData): Promise<Data>

  /**
   * @deprecated use PaymentServicePlugin.update instead
   * @param paymentSessionData
   * @param cart
   */
  updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.authorize instead
   * @param paymentSession
   * @param context
   */
  authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ data: PaymentSessionData; status: PaymentSessionStatus }>

  /**
   * @deprecated use PaymentServicePlugin.capture instead
   * @param payment
   */
  capturePayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.refund instead
   * @param payment
   * @param refundAmount
   */
  refundPayment(payment: Payment, refundAmount: number): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.cancel instead
   * @param payment
   */
  cancelPayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.cancel instead
   * @param paymentSession
   */
  deletePayment(paymentSession: PaymentSession): Promise<void>

  /**
   * @deprecated use PaymentServicePlugin.getSavedMethods instead
   * @param customer
   */
  retrieveSavedMethods(customer: Customer): Promise<Data[]>

  /**
   * @deprecated use PaymentServicePlugin.getSessionStatus instead
   * @param data
   */
  getStatus(data: Data): Promise<PaymentSessionStatus>
}

/**
 * @deprecated use the AbstractPaymentServicePlugin instead
 */
export abstract class AbstractPaymentService
  extends TransactionBaseService
  implements PaymentService
{
  protected constructor(container: unknown, config?: Record<string, unknown>) {
    super(container, config)
  }

  protected static identifier: string

  public getIdentifier(): string {
    if (!(this.constructor as typeof AbstractPaymentService).identifier) {
      throw new Error(`Missing static property "identifier".`)
    }
    return (this.constructor as typeof AbstractPaymentService).identifier
  }

  /**
   * @deprecated
   */
  public abstract getPaymentData(
    paymentSession: PaymentSession
  ): Promise<PaymentData>

  /**
   * @deprecated
   */
  public abstract updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract createPayment(cart: Cart): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract createPaymentNew(
    paymentInput: PaymentProviderDataInput
  ): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract retrievePayment(paymentData: PaymentData): Promise<Data>

  /**
   * @deprecated
   */
  public abstract updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract updatePaymentNew(
    paymentSessionData: PaymentSessionData,
    paymentInput: PaymentProviderDataInput
  ): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ data: PaymentSessionData; status: PaymentSessionStatus }>

  /**
   * @deprecated
   */
  public abstract capturePayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated
   */
  public abstract refundPayment(
    payment: Payment,
    refundAmount: number
  ): Promise<PaymentData>

  /**
   * @deprecated
   */
  public abstract cancelPayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated
   */
  public abstract deletePayment(paymentSession: PaymentSession): Promise<void>

  /**
   * @deprecated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async retrieveSavedMethods(customer: Customer): Promise<Data[]> {
    return []
  }

  /**
   * @deprecated
   */
  public abstract getStatus(data: Data): Promise<PaymentSessionStatus>
}

/**
 * The new payment service plugin interface
 */
export interface PaymentServicePlugin {
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
  create(
    context: PaymentContext
  ): Promise<PaymentPluginError | PaymentSessionResponse>

  /**
   * Update an existing payment session
   * @param sessionId
   * @param context
   */
  update(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Refund an existing session
   * @param sessionId
   * @param context
   */
  refund(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Authorize an existing session if it is not already authorized
   * @param sessionId
   * @param context
   */
  authorize(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Capture an existing session
   * @param sessionId
   * @param context
   */
  capture(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Delete an existing session
   * @param sessionId
   */
  delete(sessionId: string): Promise<PaymentPluginError | void>

  /**
   * Retrieve an existing session
   * @param sessionId
   */
  retrieve(
    sessionId: string
  ): Promise<PaymentPluginError | PaymentSessionResponse["session_data"]>

  /**
   * Cancel an existing session
   * @param sessionId
   */
  cancel(sessionId: string): Promise<PaymentPluginError | void>

  /**
   * Return the status of the session
   * @param sessionId
   */
  getSessionStatus(sessionId: string): Promise<PaymentSessionStatus>

  /**
   * An optional method to implement in order to retrieve the methods saved for a customer in case the provider
   * provide such feature. It is based on the collected data that have been given by the plugin
   * and saved on the customer
   *
   * @example
   * getSavedMethods(
   *   collectedDate: Record<string, unknown>
   * ): Promise<Record<string, unknown>[]> {
   *  if (collectedDate?.stripe_id) {
   *    const methods = await this.stripe_.paymentMethods.list({
   *      customer: collectedDate.stripe_id
   *      type: "card",
   *    })
   *
   *    return methods.data
   *  }
   *
   *  return []
   * }
   *
   * @param collectedDate
   */
  getSavedMethods(
    collectedDate: Record<string, unknown>
  ): Promise<Record<string, unknown>[]>
}

/**
 * New payment plugin service plugin API
 */
export abstract class AbstractPaymentServicePlugin
  implements PaymentServicePlugin
{
  protected constructor(
    container: MedusaContainer,
    config?: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  protected static identifier: string

  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractPaymentServicePlugin

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  abstract init(): Promise<void>

  abstract capture(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract authorize(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract cancel(sessionId: string): Promise<PaymentPluginError | void>

  abstract create(
    context: PaymentContext
  ): Promise<PaymentPluginError | PaymentSessionResponse>

  abstract delete(sessionId: string): Promise<PaymentPluginError | void>

  abstract getSavedMethods(
    collectedDate: Record<string, unknown>
  ): Promise<Record<string, unknown>[]>

  abstract getSessionStatus(sessionId: string): Promise<PaymentSessionStatus>

  abstract refund(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract retrieve(
    sessionId: string
  ): Promise<PaymentPluginError | PaymentSessionResponse["session_data"]>

  abstract update(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>
}

/**
 * Return if the input object is one of AbstractPaymentService or PaymentService or AbstractPaymentPluginService
 * @param obj
 */
export function isPaymentService(obj: unknown): boolean {
  return (
    obj instanceof AbstractPaymentService ||
    obj instanceof PaymentService ||
    obj instanceof AbstractPaymentServicePlugin
  )
}
