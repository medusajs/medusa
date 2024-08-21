import { OrderClaimType } from "../../order/mutations"

export interface BeginOrderClaimWorkflowInput {
  type: OrderClaimType
  order_id: string
  /**
   * The id of the user that creates the order claim
   */
  created_by?: string | null
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown> | null
}
