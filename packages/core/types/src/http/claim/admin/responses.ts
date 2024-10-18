import { OrderDTO } from "../../../order"
import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminOrderPreview } from "../../order"
import { AdminReturn } from "../../return"
import { AdminClaim } from "./entities"

export interface AdminClaimResponse {
  /**
   * The claim's details.
   */
  claim: AdminClaim
}

export interface AdminClaimListResponse
  extends PaginatedResponse<{
    /**
     * The list of claims.
     */
    claims: AdminClaim[]
  }> {}

export interface AdminClaimOrderResponse {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The claim's details.
   */
  claim: AdminClaim
}

export interface AdminClaimPreviewResponse {
  /**
   * Preview of the order when the claim is applied.
   */
  order_preview: AdminOrderPreview
  /**
   * The claim's details.
   */
  claim: AdminClaim
}

export interface AdminClaimReturnPreviewResponse {
  /**
   * Preview of the order when the claim is applied.
   */
  order_preview: AdminOrderPreview
  /**
   * The return's details.
   */
  return: AdminReturn
}

export interface AdminClaimRequestResponse extends AdminClaimPreviewResponse {
  return: AdminReturn
}

export interface AdminClaimDeleteResponse extends DeleteResponse<"claim"> {}
