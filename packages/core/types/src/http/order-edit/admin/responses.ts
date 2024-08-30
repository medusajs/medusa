import { OrderChangeDTO, OrderPreviewDTO } from "../../../order"
import { DeleteResponse } from "../../common"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
}

export interface AdminOrderEditResponse {
  order_change: OrderChangeDTO
}

export type AdminOrderEditDeleteResponse = DeleteResponse<"order-edit">
