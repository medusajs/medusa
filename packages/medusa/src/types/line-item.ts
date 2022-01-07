export type GenerateConfig = {
  unit_price?: number
  metadata?: object
}

export type CreateLineItemDto = {
  title: string
  description?: string
  thumbnail?: string
  is_giftcard?: boolean
  should_merge?: boolean
  has_shipping?: boolean
  allow_discounts?: boolean
  unit_price: number
  variant_id?: string
  quantity: number
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number

  cart_id?: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string

  metadata?: object
}

export type UpdateLineItemDto = {
  title?: string
  description?: string
  thumbnail?: string
  is_giftcard?: boolean
  should_merge?: boolean
  has_shipping?: boolean
  allow_discounts?: boolean
  unit_price?: number
  variant_id?: string
  quantity?: number
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number

  cart_id?: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string

  metadata?: object
}
