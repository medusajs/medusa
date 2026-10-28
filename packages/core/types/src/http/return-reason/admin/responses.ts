import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminReturnReason } from "../admin"

export interface AdminReturnReasonResponse {
  /**
   * The return reason's details.
   */
  return_reason: AdminReturnReason
}

export interface AdminReturnReasonListResponse extends PaginatedResponse<{
  /**
   * The list of return reasons.
   */
  return_reasons: AdminReturnReason[]
}> {}

export interface AdminReturnReasonDeleteResponse extends DeleteResponse<"return_reason"> {}
