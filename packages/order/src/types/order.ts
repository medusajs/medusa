import { OrderStatus } from "@medusajs/utils"

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
}
