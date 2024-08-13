import { PaginatedResponse } from "../../common"
import { AdminPayment, AdminPaymentProvider, AdminRefund, AdminRefundReason } from "./entities"

export interface AdminPaymentResponse {
  payment: AdminPayment
}

export type AdminPaymentsResponse = PaginatedResponse<{
  payments: AdminPayment[]
}>

export interface AdminRefundResponse {
  refund_reason: AdminRefund
}

export type AdminRefundsResponse = PaginatedResponse<{
  refund_reasons: AdminRefund[]
}>

export interface RefundReasonResponse {
  refund_reason: AdminRefundReason
}

export type RefundReasonsResponse = PaginatedResponse<{
  refund_reasons: AdminRefundReason[]
}>

export type AdminPaymentProviderListResponse = PaginatedResponse<{
  payment_providers: AdminPaymentProvider[]
}>