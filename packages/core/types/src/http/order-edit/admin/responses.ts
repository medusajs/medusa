import { DeleteResponse } from "../../common"
import { AdminOrderChange, AdminOrderPreview } from "../../order/admin"

export interface AdminOrderEditPreviewResponse {
  /**
   * A preview of the order when the edit is applied.
   */
  order_preview: AdminOrderPreview
}

export interface AdminOrderEditResponse {
  /**
   * The order edit's details.
   */
  order_change: AdminOrderChange
}

export type AdminOrderEditDeleteResponse = DeleteResponse<"order-edit">
