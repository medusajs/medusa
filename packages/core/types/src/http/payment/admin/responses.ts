import { DeleteResponse, PaginatedResponse } from "../../common"
import {
  AdminPayment,
  AdminPaymentCollection,
  AdminPaymentProvider,
  AdminRefund,
  AdminRefundReason,
} from "./entities"

export interface AdminPaymentCollectionResponse {
  /**
   * The payment collection's details.
   */
  payment_collection: AdminPaymentCollection
}

export interface AdminDeletePaymentCollectionResponse
  extends DeleteResponse<"payment-collection"> {}

export interface AdminPaymentCollectionsResponse {
  payment_collections: AdminPaymentCollection[]
}

export interface AdminPaymentResponse {
  /**
   * The payment's details.
   */
  payment: AdminPayment
}

export type AdminPaymentsResponse = PaginatedResponse<{
  /**
   * The list of payments.
   */
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
  /**
   * The list of payment providers.
   */
  payment_providers: AdminPaymentProvider[]
}>

export type AdminRefundReasonDeleteResponse = DeleteResponse<"refund_reason">
