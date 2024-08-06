import { BaseFilterable } from "../../dal"
import {
  BasePayment,
  BasePaymentCollection,
  BasePaymentCollectionFilters,
  BasePaymentFilters,
  BasePaymentProvider,
  BasePaymentProviderFilters,
  BasePaymentSession,
  BasePaymentSessionFilters,
  BaseRefund,
  RefundReason,
} from "./common"

export interface AdminPaymentProvider extends BasePaymentProvider {
  is_enabled: boolean
}

export interface AdminPayment extends BasePayment {}
export interface AdminPaymentCollection extends BasePaymentCollection {}
export interface AdminPaymentSession extends BasePaymentSession {}

export interface AdminPaymentProviderFilters
  extends BasePaymentProviderFilters {
  is_enabled?: boolean
}
export interface AdminPaymentCollectionFilters
  extends BasePaymentCollectionFilters {}
export interface AdminPaymentSessionFilters extends BasePaymentSessionFilters {}

export interface AdminCapturePayment {
  amount?: number
}

export interface AdminRefundPayment {
  amount?: number
  refund_reason_id?: string | null
  note?: string | null
}

export interface AdminPaymentResponse {
  payment: AdminPayment
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[]
}

export interface AdminPaymentFilters extends BasePaymentFilters {}

// Refund

export interface AdminRefund extends BaseRefund {}
export interface RefundFilters extends BaseFilterable<AdminRefund> {
  id?: string | string[]
}

export interface AdminRefundResponse {
  refund_reason: AdminRefund
}

export interface AdminRefundsResponse {
  refund_reasons: AdminRefund[]
}

// Refund reason

export interface AdminRefundReason extends RefundReason {}
export interface RefundReasonFilters extends BaseFilterable<AdminRefundReason> {
  id?: string | string[]
}

export interface RefundReasonResponse {
  refund_reason: AdminRefundReason
}

export interface RefundReasonsResponse {
  refund_reasons: AdminRefundReason[]
}

export interface AdminCreateRefundReason {
  label: string
  description?: string
}
