import { BigNumberInput } from "../../totals"

interface CreateOrderFulfillmentItem {
  id: string
  quantity: BigNumberInput
}

export interface CreateOrderFulfillmentWorkflowInput {
  order_id: string
  created_by?: string // The id of the authenticated user
  items: CreateOrderFulfillmentItem[]
  no_notification?: boolean
  location_id?: string
  metadata?: Record<string, any>
}
