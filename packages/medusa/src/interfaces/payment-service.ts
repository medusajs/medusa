import { Payment } from "@models/payment"
import { Cart } from "@models/cart"
import { PaymentSession, PaymentSessionStatus } from "@models/payment-session"
import { Customer } from "@models/customer"
import { BaseService } from "medusa-interfaces"

export type Data = Record<string, unknown>
export type PaymentData = Data
export type PaymentSessionData = Data

export interface PaymentService {
  getIdentifier(): string

  getPaymentData(paymentSession: PaymentSession): Promise<PaymentData>

  updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  createPaymentSession(cart: Cart): Promise<PaymentSessionData>

  createPayment(paymentSession: PaymentSession): Promise<PaymentData>

  retrievePayment(cart: Cart): Promise<Payment>

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

  getStatus(): PaymentSessionStatus
}

export abstract class AbstractPaymentService
  extends BaseService
  implements PaymentService
{
  protected static identifier: string

  public getIdentifier(): string {
    if (!(<typeof AbstractPaymentService>this.constructor).identifier) {
      throw new Error('Missing static property "identifier".')
    }
    return (<typeof AbstractPaymentService>this.constructor).identifier
  }

  public abstract getPaymentData(
    paymentSession: PaymentSession
  ): Promise<PaymentData>

  public abstract updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

  public abstract createPaymentSession(cart: Cart): Promise<PaymentSessionData>

  public abstract createPayment(
    paymentSession: PaymentSession
  ): Promise<PaymentData>

  public abstract retrievePayment(cart: Cart): Promise<Payment>

  public abstract updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
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
  public retrieveSavedMethods(customer: Customer): Promise<Data[]> {
    return Promise.resolve([])
  }

  public abstract getStatus(): PaymentSessionStatus
}
