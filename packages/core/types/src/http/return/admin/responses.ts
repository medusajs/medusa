import { OrderDTO } from "../../../order"
import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminOrderPreview } from "../../order"
import { AdminReturn } from "./entities"

export interface AdminReturnResponse {
  return: AdminReturn
}

export type AdminReturnsResponse = PaginatedResponse<{
  returns: AdminReturn[]
}>

export interface AdminOrderReturnResponse {
  order: OrderDTO
  return: AdminReturn
}

export interface AdminReturnPreviewResponse {
  order_preview: AdminOrderPreview
  return: AdminReturn
}

export type AdminReturnDeleteResponse = DeleteResponse<"return">
