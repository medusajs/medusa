export type CartDTO = {
  id?: string
  email?: string
  billing_address_id?: string
  shipping_address_id?: string
  region_id?: string
  customer_id?: string
  payment_id?: string
  completed_at?: Date
  payment_authorized_at?: Date
  idempotency_key?: string
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
  sales_channel_id?: string | null
  shipping_total?: number
  discount_total?: number
  raw_discount_total?: number
  item_tax_total?: number | null
  shipping_tax_total?: number | null
  tax_total?: number | null
  refunded_total?: number
  total?: number
  subtotal?: number
  refundable_amount?: number
  gift_card_total?: number
  gift_card_tax_total?: number
}
