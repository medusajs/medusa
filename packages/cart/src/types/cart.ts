export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  metadata?: Record<string, unknown>
}

export interface UpdateCartDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  metadata?: Record<string, unknown>
}

export interface CreateLineItemDTO {
  title: string
  subtitle?: string
  thumbnail?: string

  quantity: number

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
  unit_price: number
}

export interface UpdateLineItemDTO {
  id: string
  title?: string
  subtitle?: string
  thumbnail?: string

  quantity?: number

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
  unit_price?: number
}
