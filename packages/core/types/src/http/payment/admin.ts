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
}

export interface AdminPaymentResponse {
  payment: AdminPayment
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[]
}

export interface AdminPaymentFilters extends BasePaymentFilters {}

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
