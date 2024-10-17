import { PaginatedResponse } from "../../common"
import {
  AdminOrder,
  AdminOrderChange,
  AdminOrderLineItem,
  AdminOrderPreview,
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

export type AdminOrderLineItemsListResponse = PaginatedResponse<{
  line_items: AdminOrderLineItem[]
}>

export interface AdminOrderPreviewResponse {
  order: AdminOrderPreview
}

export interface AdminDraftOrderResponse {
  draft_order: AdminOrder
}

export type AdminDraftOrderListResponse = PaginatedResponse<{
  draft_orders: AdminOrder[]
}>
