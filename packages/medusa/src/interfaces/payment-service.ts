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

export type Data = Record<string, unknown>
export type PaymentData = Data
export type PaymentSessionData = Data

export type PaymentContext = {
  // TODO: type Cart is meant for backward compatibility and will be replaced by the type in comment bellow instead in the future
  cart: Cart
  /* | {
        context: Record<string, unknown>
        id: string
        customer_id?: string
        email: string
        shipping_address: Address | null
        shipping_options: ShippingMethod["shipping_option"][]
      }*/
  currency_code: string
  amount: number
  resource_id?: string
  collected_data: Record<string, unknown>
}

export type PaymentSessionResponse = {
  collected_data: { customer: Record<string, unknown> }
  session_data: Record<string, unknown>
}

export interface PaymentService extends TransactionBaseService {
  getIdentifier(): string

  getPaymentData(paymentSession: PaymentSession): Promise<PaymentData>

  updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  /**
   * @param context The type of this argument is meant to be temporary and once the previous method signature
   * will be removed, the type will only be PaymentContext instead of Cart & PaymentContext
   */
  createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse>

  /**
   * @deprecated use createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse> instead
   * @param cart
   */
  createPayment(cart: Cart): Promise<PaymentSessionData>

  retrievePayment(paymentData: PaymentData): Promise<Data>

  updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData>

  authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ data: PaymentSessionData; status: PaymentSessionStatus }>

  capturePayment(payment: Payment): Promise<PaymentData>

  refundPayment(payment: Payment, refundAmount: number): Promise<PaymentData>

  cancelPayment(payment: Payment): Promise<PaymentData>

  deletePayment(paymentSession: PaymentSession): Promise<void>

  retrieveSavedMethods(customer: Customer): Promise<Data[]>

  getStatus(data: Data): Promise<PaymentSessionStatus>
}

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

  public abstract getPaymentData(
    paymentSession: PaymentSession
  ): Promise<PaymentData>

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
   * @deprecated use createPayment(context: CreateSessionContext): Promise<PaymentSessionResponse> instead
   * @param cart
   */
  public abstract createPayment(cart: Cart): Promise<PaymentSessionData>

  /**
   * @param context
   */
  public abstract createPaymentNew(
    context: PaymentContext
  ): Promise<PaymentSessionResponse>

  /**
   * @deprecated
   * @param paymentInput
   */
  public abstract createPaymentNew(
    paymentInput: PaymentProviderDataInput
  ): Promise<PaymentSessionData>

  public abstract retrievePayment(paymentData: PaymentData): Promise<Data>

  public abstract updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData>

  public abstract updatePaymentNew(
    paymentSessionData: PaymentSessionData,
    paymentInput: PaymentProviderDataInput
  ): Promise<PaymentSessionData>

  public abstract authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ data: PaymentSessionData; status: PaymentSessionStatus }>

  public abstract capturePayment(payment: Payment): Promise<PaymentData>

  public abstract refundPayment(
    payment: Payment,
    refundAmount: number
  ): Promise<PaymentData>

  public abstract cancelPayment(payment: Payment): Promise<PaymentData>

  public abstract deletePayment(paymentSession: PaymentSession): Promise<void>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async retrieveSavedMethods(customer: Customer): Promise<Data[]> {
    return []
  }

  public abstract getStatus(data: Data): Promise<PaymentSessionStatus>
}

export function isPaymentService(obj: unknown): boolean {
  return obj instanceof AbstractPaymentService || obj instanceof PaymentService
}
