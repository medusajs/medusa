export type ShippingOptionDTO = {
  id?: string
  shipping_option_id?: string
  order_id?: string
  claim_order_id?: string | null
  cart_id?: string
  swap_id?: string
  return_id?: string
  tax_lines?: any[]
  price?: number
  data?: Record<string, unknown>
  includes_tax?: boolean
  subtotal?: number
  total?: number
  tax_total?: number
}
