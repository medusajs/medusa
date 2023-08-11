type OrdersReturnItem = {
  item_id: string
  quantity: number
  reason_id?: string
  note?: string
}

export type CreateReturnInput = {
  order_id: string
  swap_id?: string
  claim_order_id?: string
  items?: OrdersReturnItem[]
  shipping_method?: {
    option_id?: string
    price?: number
  }
  no_notification?: boolean
  metadata?: Record<string, unknown>
  refund_amount?: number
  location_id?: string
}

export type UpdateReturnInput = {
  items?: OrdersReturnItem[]
  shipping_method?: {
    option_id: string
    price?: number
  }
  no_notification?: boolean
  metadata?: Record<string, unknown>
}
