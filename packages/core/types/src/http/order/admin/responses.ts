import { PaginatedResponse } from "../../common"
import {
  AdminOrder,
  AdminOrderChange,
  AdminOrderPreview,
  AdminOrderItem,
} from "./entities"

export interface AdminOrderResponse {
  order: AdminOrder
}

export interface AdminOrderChangesResponse {
  order_changes: AdminOrderChange[]
}

export type AdminOrderListResponse = PaginatedResponse<{
  orders: AdminOrder[]
}>

export interface AdminOrderPreviewResponse {
  order: AdminOrderPreview
}

export type AdminOrderLineItemsListResponse = {
  order_items: AdminOrderItem[]
}

export interface AdminDraftOrderResponse {
  draft_order: AdminOrder
}

export type AdminDraftOrderListResponse = PaginatedResponse<{
  draft_orders: AdminOrder[]
}>
