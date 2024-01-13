import { CreateLineItemAdjustmentDTO } from "@medusajs/types"

export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  metadata?: Record<string, unknown>
}

export interface UpdateCartDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  metadata?: Record<string, unknown>

  adjustments?: (CreateLineItemAdjustmentDTO | CreateLineItemAdjustmentDTO)[]
}
