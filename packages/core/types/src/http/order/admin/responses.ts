import { PaginatedResponse } from "../../common"
import { AdminOrder, AdminOrderPreview } from "./entities"

export interface AdminOrderResponse {
  order: AdminOrder
}

export type AdminOrderListResponse = PaginatedResponse<{
  orders: AdminOrder[]
}>

export interface AdminOrderPreviewResponse {
  order: AdminOrderPreview
}

export interface AdminDraftOrderResponse {
  draft_order: AdminOrder
}

export type AdminDraftOrderListResponse = PaginatedResponse<{
  draft_orders: AdminOrder
}>