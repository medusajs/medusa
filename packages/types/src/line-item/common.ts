// TODO
export type LineItemTaxLineDTO = {}

// TODO
export type LineItemAdjustmentDTO = {}

export type LineItemDTO = {
  id: string
  title: string
  description?: string
  thumbnail?: string

  variant_id?: string
  quantity: number
  unit_price: number

  cart_id?: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string

  tax_lines?: Array<LineItemTaxLineDTO>
  adjustments?: Array<LineItemAdjustmentDTO>

  original_item_id?: string
  order_edit_id?: string

  is_return: boolean
  is_giftcard: boolean

  should_merge: boolean
  allow_discounts: boolean
  has_shipping?: boolean

  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number
  refundable?: number

  includes_tax?: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>

  // totals
  subtotal?: number
  tax_total?: number
  total?: number
  original_total?: number
  original_tax_total?: number
  discount_total?: number
  raw_discount_total?: number
  gift_card_total?: number
}
