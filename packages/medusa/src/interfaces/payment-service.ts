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

export interface PaymentService extends TransactionBaseService {
  getIdentifier(): string

  getPaymentData(paymentSession: PaymentSession): Promise<PaymentData>

  updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData>

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

  public abstract createPayment(cart: Cart): Promise<PaymentSessionData>
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
    return Promise.resolve([])
  }

  public abstract getStatus(data: Data): Promise<PaymentSessionStatus>
}

export function isPaymentService(obj: unknown): boolean {
  return obj instanceof AbstractPaymentService || obj instanceof PaymentService
}
