import { OrderDTO } from "../../../order"
import { DeleteResponse, PaginatedResponse } from "../../common"
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
  order: OrderDTO
  claim: AdminClaim
}

export interface AdminClaimPreviewResponse {
  order_preview: OrderDTO
  claim: AdminClaim
}

export interface AdminClaimReturnPreviewResponse {
  order_preview: OrderDTO
  return: AdminReturn
}

export interface AdminClaimRequestResponse extends AdminClaimPreviewResponse {
  return: AdminReturn
}

export interface AdminClaimDeleteResponse extends DeleteResponse<"claim"> {}
