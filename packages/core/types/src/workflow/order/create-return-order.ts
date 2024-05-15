import { RegionDTO } from "../../region"
import { BigNumberInput } from "../../totals"

interface CreateOrderReturnItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string
  reason_id?: string
  metadata?: Record<string, any>
}

export interface CreateOrderReturnWorkflowInput {
  order_id: string
  created_by?: string // The id of the authenticated user
  items: CreateOrderReturnItem[]
  return_shipping: {
    option_id: string
    price?: number
  }
  note?: string
  receive_now?: boolean
  refund_amount?: number
  location_id: string
  provider_id: string
  region?: RegionDTO
}
