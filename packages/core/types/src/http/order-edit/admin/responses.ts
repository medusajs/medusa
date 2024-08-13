import { OrderDTO, OrderPreviewDTO } from "../../../order"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
  order: OrderDTO
}

export interface AdminOrderEditRequestResponse {
  order_preview: OrderPreviewDTO
  order: OrderDTO
}
