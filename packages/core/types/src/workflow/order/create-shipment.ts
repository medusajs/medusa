import { BigNumberInput } from "../../totals"

interface CreateOrderShipmentItem {
  id: string
  quantity: BigNumberInput
}

export interface CreateOrderShipmentWorkflowInput {
  order_id: string
  fulfillment_id: string
  created_by?: string // The id of the authenticated user
  items: CreateOrderShipmentItem[]
  no_notification?: boolean
  metadata: Record<string, any>
}
