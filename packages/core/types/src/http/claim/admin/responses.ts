import { OrderDTO, OrderPreviewDTO } from "../../../order"
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
  order_preview: OrderPreviewDTO
  claim: AdminClaim
}

export interface AdminClaimReturnPreviewResponse {
  order_preview: OrderPreviewDTO
  return: AdminReturn
}

export interface AdminClaimRequestResponse extends AdminClaimPreviewResponse {
  return: AdminReturn
}

export interface AdminClaimDeleteResponse extends DeleteResponse<"claim"> {}
