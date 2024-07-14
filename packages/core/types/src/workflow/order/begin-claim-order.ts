import { OrderClaimType } from "../../order/mutations"

export interface beginOrderClaimWorkflowInput {
  type: OrderClaimType
  order_id: string
  created_by?: string
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown> | null
}
