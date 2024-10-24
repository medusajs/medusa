import { PaginatedResponse } from "../../common"
import {
  AdminOrder,
  AdminOrderChange,
  AdminOrderItem,
  AdminOrderPreview,
} from "./entities"

export interface AdminOrderResponse {
  /**
   * The order's details.
   */
  order: AdminOrder
}

export interface AdminOrderChangesResponse {
  /**
   * The list of order changes.
   */
  order_changes: AdminOrderChange[]
}

export type AdminOrderListResponse = PaginatedResponse<{
  /**
   * The list of orders.
   */
  orders: AdminOrder[]
}>

export type AdminOrderLineItemsListResponse = {
  /**
   * The list of order items.
   */
  order_items: AdminOrderItem[]
}

export interface AdminOrderPreviewResponse {
  /**
   * A preview of the order if the latest change, such as exchange, return, edit, or claim is applied on it.
   */
  order: AdminOrderPreview
}

export interface AdminDraftOrderResponse {
  draft_order: AdminOrder
}

export type AdminDraftOrderListResponse = PaginatedResponse<{
  draft_orders: AdminOrder[]
}>
