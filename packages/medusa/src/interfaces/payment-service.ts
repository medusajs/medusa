import { TransactionBaseService } from "./transaction-base-service"
import {
  Address,
  Cart,
  Customer,
  Payment,
  PaymentSession,
  PaymentSessionStatus,
  ShippingMethod,
} from "../models"
import { PaymentService } from "medusa-interfaces"
import { MedusaContainer } from "../types/global"

export type Data = Record<string, unknown>
export type PaymentData = Data
export type PaymentSessionData = Data

export type PaymentContext = {
  cart?: {
    context: Record<string, unknown>
    id: string
    email: string
    shipping_address: Address | null
    shipping_methods: ShippingMethod[]
  }
  currency_code: string
  amount: number
  resource_id?: string
  customer?: Customer
}

export type PaymentSessionResponse = {
  update_requests: { customer_metadata: Record<string, unknown> }
  session_data: Record<string, unknown>
}

export interface PaymentPluginError {
  error: string
  code: number
  details: any
}

/** ***************     Old Plugin API     *************** **/

/**
 * @deprecated use the new PaymentServicePlugin interface instead
 * The old payment service plugin interface
 */
export interface PaymentService extends TransactionBaseService {
  getIdentifier(): string

  /**
   * @deprecated use PaymentServicePlugin.retrievePayment instead
   * @param paymentSession
   */
  getPaymentData(paymentSession: PaymentSession): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.updatePayment instead
   * @param paymentSessionData
   * @param data
   */
  updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.createPayment instead
   * @param context The type of this argument is meant to be temporary and once the previous method signature
   * will be removed, the type will only be PaymentContext instead of Cart & PaymentContext
   */
  createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse>

  /**
   * @deprecated use createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse> instead
   * @param cart
   */
  createPayment(cart: Cart): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.retrievePayment instead
   * @param paymentData
   */
  retrievePayment(paymentData: PaymentData): Promise<Data>

  /**
   * @deprecated use PaymentServicePlugin.updatePayment instead
   * @param paymentSessionData
   * @param cart
   */
  updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData>

  /**
   * @deprecated use PaymentServicePlugin.authorizePayment instead
   * @param paymentSession
   * @param context
   */
  authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ data: PaymentSessionData; status: PaymentSessionStatus }>

  /**
   * @deprecated use PaymentServicePlugin.capturePayment instead
   * @param payment
   */
  capturePayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.refundPayment instead
   * @param payment
   * @param refundAmount
   */
  refundPayment(payment: Payment, refundAmount: number): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.cancelPayment instead
   * @param payment
   */
  cancelPayment(payment: Payment): Promise<PaymentData>

  /**
   * @deprecated use PaymentServicePlugin.cancelPayment instead
   * @param paymentSession
   */
  deletePayment(paymentSession: PaymentSession): Promise<void>

  /**
   * @deprecated use PaymentServicePlugin.getSavedMethods instead
   * @param customer
   */
  retrieveSavedMethods(customer: Customer): Promise<Data[]>

  /**
   * @deprecated use PaymentServicePlugin.getPaymentStatus instead
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
   * @param context The type of this argument is meant to be temporary and once the previous method signature
   * will be removed, the type will only be PaymentContext instead of Cart & PaymentContext
   */
  public abstract createPayment(
    context: Cart & PaymentContext
  ): Promise<PaymentSessionResponse>

  /**
   * @deprecated use createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse> instead
   * @param cart
   */
  public abstract createPayment(cart: Cart): Promise<PaymentSessionData>

  /**
   * @deprecated
   */
  public abstract retrievePayment(paymentData: PaymentData): Promise<Data>

  /**
   * @param paymentSessionData
   * @param context The type of this argument is meant to be temporary and once the previous method signature
   * will be removed, the type will only be PaymentContext instead of Cart & PaymentContext
   */
  public abstract updatePayment(
    paymentSessionData: PaymentSessionData,
    context: Cart & PaymentContext
  ): Promise<PaymentSessionResponse>

  /**
   * @deprecated use updatePayment(paymentSessionData: PaymentSessionData, context: Cart & PaymentContext): Promise<PaymentSessionResponse> instead
   * @param paymentSessionData
   * @param cart
   */
  public abstract updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
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

/** ***************     New Plugin API     *************** **/

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
  createPayment(
    context: PaymentContext
  ): Promise<PaymentPluginError | PaymentSessionResponse>

  /**
   * Update an existing payment session
   * @param sessionId
   * @param context
   */
  updatePayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Refund an existing session
   * @param sessionId
   * @param context
   */
  refundPayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Authorize an existing session if it is not already authorized
   * @param sessionId
   * @param context
   */
  authorizePayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Capture an existing session
   * @param sessionId
   * @param context
   */
  capturePayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  /**
   * Delete an existing session
   * @param sessionId
   */
  deletePayment(sessionId: string): Promise<PaymentPluginError | void>

  /**
   * Retrieve an existing session
   * @param sessionId
   */
  retrievePayment(
    sessionId: string
  ): Promise<PaymentPluginError | PaymentSessionResponse["session_data"]>

  /**
   * Cancel an existing session
   * @param sessionId
   */
  cancelPayment(sessionId: string): Promise<PaymentPluginError | void>

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

  abstract capturePayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract authorizePayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract cancelPayment(sessionId: string): Promise<PaymentPluginError | void>

  abstract createPayment(
    context: PaymentContext
  ): Promise<PaymentPluginError | PaymentSessionResponse>

  abstract deletePayment(sessionId: string): Promise<PaymentPluginError | void>

  abstract getSavedMethods(
    collectedDate: Record<string, unknown>
  ): Promise<Record<string, unknown>[]>

  abstract getPaymentStatus(sessionId: string): Promise<PaymentSessionStatus>

  abstract refundPayment(
    sessionId: string,
    context: PaymentContext
  ): Promise<PaymentPluginError | void>

  abstract retrievePayment(
    sessionId: string
  ): Promise<PaymentPluginError | PaymentSessionResponse["session_data"]>

  abstract updatePayment(
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
