import { OrderPreviewDTO } from "../../../order"

export interface AdminOrderEditPreviewResponse {
  order_preview: OrderPreviewDTO
}

export interface AdminOrderEditDeleteResponse {
  id: string
  object: "order-edit"
  deleted: true
}
