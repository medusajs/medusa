import { ReturnStatus } from "../../order"

export interface BaseReturnItem {
  id: string
  quantity: number
  received_quantity: number
  damaged_quantity: number
  reason_id?: string
  note?: string
  item_id: string
  return_id: string
  metadata?: Record<string, unknown>
}

export interface BaseReturn {
  id: string
  order_id: string
  status?: ReturnStatus
  exchange_id?: string
  location_id?: string
  claim_id?: string
  order_version: number
  display_id: number
  no_notification?: boolean
  refund_amount?: number
  items: BaseReturnItem[]
  received_at: string
  created_at: string
  canceled_at: string
}
