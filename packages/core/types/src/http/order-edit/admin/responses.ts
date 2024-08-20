import { OrderChangeDTO, OrderPreviewDTO } from "../../../order"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
}

export interface AdminOrderEditResponse {
  order_change: OrderChangeDTO
}
