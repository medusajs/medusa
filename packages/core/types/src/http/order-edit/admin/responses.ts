import { OrderChangeDTO, OrderPreviewDTO } from "../../../order"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
}

export interface AdminOrderEditResponse {
  order_change: OrderChangeDTO
}

export interface AdminOrderEditDeleteResponse {
  id: string
  object: "order-edit"
  deleted: true
}
