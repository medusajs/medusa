import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminClaim } from "./entities"

export interface AdminClaimResponse {
  claim: AdminClaim
}

export interface AdminClaimListResponse
  extends PaginatedResponse<{
    claims: AdminClaim[]
  }> {}

export interface AdminClaimDeleteResponse extends DeleteResponse<"claim"> {}
