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

export interface AdminPayment extends BasePayment {}
export interface AdminPaymentCollection extends BasePaymentCollection {}
export interface AdminPaymentSession extends BasePaymentSession {}
export interface AdminRefund extends BaseRefund {}
export interface AdminRefundReason extends RefundReason {}