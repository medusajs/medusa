import { BigNumberInput } from "../../totals"

interface ReceiveReturnItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string
  metadata?: Record<string, any> | null
}

export interface BeginReceiveOrderReturnWorkflowInput {
  return_id: string
  created_by?: string // The id of the authenticated user
  description?: string
  internal_note?: string
  metadata?: Record<string, any> | null
}

export interface ReceiveOrderReturnItemsWorkflowInput {
  return_id: string
  items: ReceiveReturnItem[]
}

export interface ReceiveCompleteOrderReturnWorkflowInput {
  return_id: string
  created_by?: string // The id of the authenticated user
  items: ReceiveReturnItem[]
  description?: string
  internal_note?: string
  metadata?: Record<string, any> | null
}
