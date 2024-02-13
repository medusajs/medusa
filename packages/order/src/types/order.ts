import {
  CreateOrderLineItemAdjustmentDTO,
  UpdateOrderLineItemAdjustmentDTO,
} from "./line-item-adjustment"

export interface CreateOrderDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  metadata?: Record<string, unknown>
}

export interface UpdateOrderDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  metadata?: Record<string, unknown>

  adjustments?: (
    | CreateOrderLineItemAdjustmentDTO
    | UpdateOrderLineItemAdjustmentDTO
  )[]
}
