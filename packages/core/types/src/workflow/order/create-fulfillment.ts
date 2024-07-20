import { BigNumberInput } from "../../totals"
import { CreateFulfillmentLabelWorkflowDTO } from "../fulfillment/create-fulfillment"

interface CreateOrderFulfillmentItem {
  id: string
  quantity: BigNumberInput
}

export interface CreateOrderFulfillmentWorkflowInput {
  order_id: string
  created_by?: string // The id of the authenticated user
  items: CreateOrderFulfillmentItem[]
  labels?: CreateFulfillmentLabelWorkflowDTO[]
  no_notification?: boolean
  location_id?: string | null
  metadata?: Record<string, any> | null
}
