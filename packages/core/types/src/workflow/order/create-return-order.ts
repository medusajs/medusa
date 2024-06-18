import { BigNumberInput } from "../../totals"

interface CreateOrderReturnItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string | null
  reason_id?: string | null
  metadata?: Record<string, any>
}

export interface CreateOrderReturnWorkflowInput {
  order_id: string
  created_by?: string | null // The id of the authenticated user
  items: CreateOrderReturnItem[]
  return_shipping: {
    option_id: string
    price?: number
  }
  note?: string | null
  receive_now?: boolean
  refund_amount?: number
  /**
   * Default fallback to the shipping option location id
   */
  location_id?: string | null
}
