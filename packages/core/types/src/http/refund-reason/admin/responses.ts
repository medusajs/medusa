import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminRefundReason } from "./entities"

export interface AdminRefundReasonResponse {
  /**
   * The refund reason's details.
   */
  refund_reason: AdminRefundReason
}

export interface AdminRefundReasonListResponse extends PaginatedResponse<{
  /**
   * The list of refund reasons.
   */
  refund_reasons: AdminRefundReason[]
}> {}

export interface AdminRefundReasonDeleteResponse extends DeleteResponse<"refund_reason"> {}
