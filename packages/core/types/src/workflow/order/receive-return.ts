import { BigNumberInput } from "../../totals"

interface ReceiveReturnItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string | null
  reason_id?: string | null
  note?: string | null
  metadata?: Record<string, any>
}

export interface ReceiveOrderReturnWorkflowInput {
  return_id: string
  created_by?: string | null // The id of the authenticated user
  items: ReceiveReturnItem[]
  internal_note?: string | null
}
