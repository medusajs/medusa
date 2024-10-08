import {
  BasePayment,
  BasePaymentCollection,
  BasePaymentProvider,
  BasePaymentSession,
  BaseRefund,
  RefundReason,
} from "../common"

export interface AdminPaymentProvider extends BasePaymentProvider {
  is_enabled: boolean
}

export interface AdminPayment extends BasePayment {
  refunds?: AdminRefund[]
  payment_collection?: AdminPaymentCollection
  payment_session?: AdminPaymentSession
}
export interface AdminPaymentCollection extends BasePaymentCollection {
  payments?: AdminPayment[]
  payment_sessions?: AdminPaymentSession[]
  payment_providers: AdminPaymentProvider[]
}
export interface AdminPaymentSession extends BasePaymentSession {
  payment_collection?: AdminPaymentCollection
}
export interface AdminRefund extends BaseRefund {}
export interface AdminRefundReason extends RefundReason {}
