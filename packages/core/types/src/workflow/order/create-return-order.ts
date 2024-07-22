import { BigNumberInput } from "../../totals"
import { CreateFulfillmentLabelWorkflowDTO } from "../fulfillment/create-fulfillment"

export interface CreateReturnItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string | null
  reason_id?: string | null
  note?: string | null
  metadata?: Record<string, any> | null
}

export interface CreateOrderReturnWorkflowInput {
  order_id: string
  created_by?: string | null // The id of the authenticated user
  items: CreateReturnItem[]
  return_shipping?: {
    option_id: string
    price?: number
    labels?: CreateFulfillmentLabelWorkflowDTO[]
  }
  note?: string | null
  receive_now?: boolean
  refund_amount?: number
  /**
   * Default fallback to the shipping option location id
   */
  location_id?: string | null
}
