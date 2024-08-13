import { OrderDTO, OrderPreviewDTO } from "../../../order"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
  order: OrderDTO
}
