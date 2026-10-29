import { PaginatedResponse } from "../../common"
import { AdminDraftOrder, AdminDraftOrderPreview } from "./entities"

export interface AdminDraftOrderResponse {
  /**
   * The details of the draft order.
   */
  draft_order: AdminDraftOrder
}

export interface AdminDraftOrderListResponse extends PaginatedResponse<{
  /**
   * The list of draft orders.
   */
  draft_orders: AdminDraftOrder[]
}> {}

export interface AdminDraftOrderPreviewResponse {
  /**
   * The details of the preview on the draft order.
   */
  draft_order_preview: AdminDraftOrderPreview
}
