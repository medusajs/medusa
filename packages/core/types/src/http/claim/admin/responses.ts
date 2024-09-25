import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminOrder, AdminOrderPreview } from "../../order"
import { AdminReturn } from "../../return"
import { AdminClaim } from "./entities"

export interface AdminClaimResponse {
  claim: AdminClaim
}

export interface AdminClaimListResponse
  extends PaginatedResponse<{
    claims: AdminClaim[]
  }> {}

export interface AdminClaimOrderResponse {
  order: AdminOrder
  claim: AdminClaim
}

export interface AdminClaimPreviewResponse {
  order_preview: AdminOrderPreview
  claim: AdminClaim
}

export interface AdminClaimReturnPreviewResponse {
  order_preview: AdminOrderPreview
  return: AdminReturn
}

export interface AdminClaimRequestResponse extends AdminClaimPreviewResponse {
  return: AdminReturn
}

export interface AdminClaimDeleteResponse extends DeleteResponse<"claim"> {}
