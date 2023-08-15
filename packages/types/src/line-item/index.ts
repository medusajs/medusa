export type AddLineItemVariantToCartDTO = {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown>
  unit_price?: number
  region_id: string
  customer_id?: string
}
