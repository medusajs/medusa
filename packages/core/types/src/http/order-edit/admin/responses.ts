import { DeleteResponse } from "../../common"
import { AdminOrderChange, AdminOrderPreview } from "../../order/admin"

export interface AdminOrderEditPreviewResponse {
  order_preview: AdminOrderPreview
}

export interface AdminOrderEditResponse {
  order_change: AdminOrderChange
}

export type AdminOrderEditDeleteResponse = DeleteResponse<"order-edit">
