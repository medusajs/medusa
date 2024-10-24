import {
  BasePayment,
  BasePaymentCollection,
  BasePaymentProvider,
  BasePaymentSession,
  BaseRefund,
  RefundReason,
} from "../common"

export interface AdminPaymentProvider extends BasePaymentProvider {
  /**
   * Whether the payment provider is enabled.
   */
  is_enabled: boolean
}

export interface AdminPayment extends BasePayment {
  /**
   * The associated refunds.
   */
  refunds?: AdminRefund[]
  /**
   * The payment collection this payment belongs to.
   */
  payment_collection?: AdminPaymentCollection
  /**
   * The associated payment session.
   */
  payment_session?: AdminPaymentSession
}
export interface AdminPaymentCollection extends BasePaymentCollection {
  /**
   * The associated payments.
   */
  payments?: AdminPayment[]
  /**
   * The associated payment sessions.
   */
  payment_sessions?: AdminPaymentSession[]
  /**
   * The associated payment providers.
   */
  payment_providers: AdminPaymentProvider[]
}
export interface AdminPaymentSession extends BasePaymentSession {
  /**
   * The payment collection this payment session belongs to.
   */
  payment_collection?: AdminPaymentCollection
}
export interface AdminRefund extends BaseRefund {}
export interface AdminRefundReason extends RefundReason {}
