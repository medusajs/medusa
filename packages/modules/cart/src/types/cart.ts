import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "./line-item-adjustment"

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
  customer_id?: string | null
  sales_channel_id?: string | null
  email?: string | null
  currency_code?: string
  metadata?: Record<string, unknown> | null

  adjustments?: (CreateLineItemAdjustmentDTO | UpdateLineItemAdjustmentDTO)[]
}
