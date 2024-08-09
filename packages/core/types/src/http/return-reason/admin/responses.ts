import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminReturnReason } from "../admin"

export interface AdminReturnReasonResponse {
  return_reason: AdminReturnReason
}

export interface AdminReturnReasonListResponse
  extends PaginatedResponse<{
    return_reasons: AdminReturnReason[]
  }> {}

export interface AdminReturnReasonDeleteResponse
  extends DeleteResponse<"return_reason"> {}
