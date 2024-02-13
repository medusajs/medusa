interface PartialUpsertOrderLineItemDTO {
  subtitle?: string
  thumbnail?: string

  product_id?: string
  product_title?: string
  product_description?: string
  product_subtitle?: string
  product_type?: string
  product_collection?: string
  product_handle?: string

  variant_id?: string
  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  variant_option_values?: Record<string, unknown>

  requires_shipping?: boolean
  is_discountable?: boolean
  is_tax_inclusive?: boolean

  compare_at_unit_price?: number
}

export interface CreateOrderLineItemDTO extends PartialUpsertOrderLineItemDTO {
  title: string
  quantity: number
  unit_price: number | string
  order_id: string
}

export interface UpdateOrderLineItemDTO
  extends PartialUpsertOrderLineItemDTO,
    Partial<CreateOrderLineItemDTO> {
  id: string
}
