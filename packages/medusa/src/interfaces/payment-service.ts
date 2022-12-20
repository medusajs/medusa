import { TransactionBaseService } from "./transaction-base-service"
import {
  Cart,
  Customer,
  Payment,
  PaymentSession,
  PaymentSessionStatus,
} from "../models"
import { PaymentService } from "medusa-interfaces"
import {
  PaymentProcessorContext,
  PaymentProcessorSessionResponse,
} from "../types/payment-processor"

export type Data = Record<string, unknown>
export type PaymentData = Data
export type PaymentSessionData = Data

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
  createPayment(
    context: Cart & PaymentProcessorContext
  ): Promise<PaymentProcessorSessionResponse>

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
    context: Cart & PaymentProcessorContext
  ): Promise<PaymentProcessorSessionResponse>

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
    context: Cart & PaymentProcessorContext
  ): Promise<PaymentProcessorSessionResponse>

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

/**
 * Return if the input object is one of AbstractPaymentService or PaymentService or AbstractPaymentPluginService
 * @param obj
 */
export function isPaymentService(obj: unknown): boolean {
  return obj instanceof AbstractPaymentService || obj instanceof PaymentService
}
