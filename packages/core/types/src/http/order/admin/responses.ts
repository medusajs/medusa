import { PaginatedResponse } from "../../common"
import { BaseOrderChange } from "../common"
import { AdminOrder, AdminOrderPreview } from "./entities"

export interface AdminOrderResponse {
  order: AdminOrder
}

export interface AdminOrderChangesResponse {
  order_changes: BaseOrderChange[]
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
