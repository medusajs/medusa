import { OrderStatus } from "@medusajs/utils"
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
  status?: OrderStatus
  no_notification?: boolean
  metadata?: Record<string, unknown>
}

export interface UpdateOrderDTO {
  id: string
  version?: number
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  status?: OrderStatus
  no_notification?: boolean
  metadata?: Record<string, unknown>

  adjustments?: (
    | CreateOrderLineItemAdjustmentDTO
    | UpdateOrderLineItemAdjustmentDTO
  )[]
}
