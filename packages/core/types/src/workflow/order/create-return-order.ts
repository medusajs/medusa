import { RegionDTO } from "../../region"

interface CreateOrderReturnItem {
  item_id: string
  quantity: number
  internal_note?: string
  reason_id?: string
  metadata?: Record<string, any>
}

export interface CreateOrderReturnWorkflowInput {
  order_id: string
  created_by: string // The id of the authenticated user
  items: CreateOrderReturnItem[]
  return_shipping: {
    option_id: string
    price?: number
  }
  note?: string
  receive_now?: boolean
  refund?: boolean
  location_id?: string
  region?: RegionDTO
}
