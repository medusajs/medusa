import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

export interface UpsertAddressDTO {
  customer_id?: string
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  metadata?: Record<string, unknown>
}

export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string

  email: string
  currency_code: string

  shipping_address_id?: string
  billing_address_id?: string
  billing_address?: UpsertAddressDTO | string
  shipping_address?: UpsertAddressDTO | string

  metadata?: Record<string, unknown>
}

export interface UpdateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string

  shipping_address_id?: string
  billing_address_id?: string
  billing_address?: UpsertAddressDTO | string
  shipping_address?: UpsertAddressDTO | string

  metadata?: Record<string, unknown>
}

export interface TaxLineDTO {
  id: string

  code: string
  rate: number

  description?: string | null
  tax_rate_id?: string | null
  provider_id?: string | null

  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface AdjustmentLineDTO {
  id: string

  code: string
  amount: number

  description?: string | null
  promotion_id?: string | null
  provider_id?: string | null
}

export interface ShippingMethodAdjustmentLine {
  shipping_method_id: string
  shipping_method: ShippingMethodDTO

  adjustment_line_id: string
  adjustment_line: AdjustmentLineDTO
}

export interface LineItemAdjustmentLine {
  line_item_id: string
  line_item: LineItemDTO

  adjustment_line_id: string
  adjustment_line: AdjustmentLineDTO
}

export interface ShippingMethodTaxLineDTO {
  shipping_method_id: string
  shipping_method: ShippingMethodDTO

  tax_line_id: string
  tax_line: TaxLineDTO
}

export interface LineItemTaxLineDTO {
  line_item_id: string
  line_item: LineItemDTO

  tax_line_id: string
  tax_line: TaxLineDTO
}

export interface AddressDTO {
  id: string

  customer_id?: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  company?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  country_code?: string | null
  province?: string | null
  postal_code?: string | null

  metadata?: Record<string, unknown> | null

  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export interface ShippingMethodDTO {
  id: string

  cart_id: string

  title: string
  description?: string | null

  unit_price: number

  tax_inclusive: boolean

  shipping_option_id?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null

  cart: CartDTO
  tax_lines: ShippingMethodTaxLineDTO[]
  adjustments: ShippingMethodAdjustmentLine[]

  original_total: number
  original_subtotal: number
  original_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number

  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
}

export interface LineItemDTO {
  id: string

  cart_id: string

  title: string
  subtitle?: string | null
  thumbnail?: string | null

  quantity: number

  product_id?: string | null
  product_title?: string | null
  product_description?: string | null
  product_subtitle?: string | null
  product_type?: string | null
  product_collection?: string | null
  product_handle?: string | null

  variant_id?: string | null
  variant_sku?: string | null
  variant_barcode?: string | null
  variant_title?: string | null
  variant_option_values?: Record<string, unknown> | null

  requires_shipping: boolean
  is_discountable: boolean
  is_tax_inclusive: boolean

  compare_at_unit_price?: number | null
  unit_price: number

  cart: CartDTO

  tax_lines: LineItemTaxLineDTO[]
  adjustments: LineItemAdjustmentLine[]

  compare_at_total: number
  compare_at_subtotal: number
  compare_at_tax_total: number

  original_total: number
  original_subtotal: number
  original_tax_total: number

  item_total: number
  item_subtotal: number
  item_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number

  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export interface CreateLineItemDTO {
  cart_id: string

  title: string
  subtitle?: string | null
  thumbnail?: string | null

  quantity: number

  product_id?: string | null
  product_title?: string | null
  product_description?: string | null
  product_subtitle?: string | null
  product_type?: string | null
  product_collection?: string | null
  product_handle?: string | null

  variant_id?: string | null
  variant_sku?: string | null
  variant_barcode?: string | null
  variant_title?: string | null
  variant_option_values?: Record<string, unknown> | null

  requires_shipping?: boolean | null
  is_discountable?: boolean | null
  is_tax_inclusive?: boolean | null

  compare_at_unit_price?: number | null
  unit_price: number

  // tax_lines: LineItemTaxLineDTO[]
  // adjustments: LineItemAdjustmentLine[]
}

export interface UpdateLineItemDTO {
  id: string

  title?: string | null
  subtitle?: string | null
  thumbnail?: string | null

  quantity?: number | null

  product_id?: string | null
  product_title?: string | null
  product_description?: string | null
  product_subtitle?: string | null
  product_type?: string | null
  product_collection?: string | null
  product_handle?: string | null

  variant_id?: string | null
  variant_sku?: string | null
  variant_barcode?: string | null
  variant_title?: string | null
  variant_option_values?: Record<string, unknown> | null

  requires_shipping?: boolean | null
  is_discountable?: boolean | null
  is_tax_inclusive?: boolean | null

  compare_at_unit_price?: number | null
  unit_price?: number | null

  // tax_lines: LineItemTaxLineDTO[]
  // adjustments: LineItemAdjustmentLine[]
}

export interface CartDTO {
  id: string
  region_id?: string | null
  customer_id?: string | null
  sales_channel_id?: string | null

  email: string
  currency_code: string

  shipping_address_id?: string | null
  shipping_address?: AddressDTO | null

  billing_address_id?: string | null
  billing_address?: AddressDTO | null

  metadata?: Record<string, unknown> | null

  items: LineItemDTO[]

  shipping_methods: ShippingMethodDTO[]

  compare_at_item_total: number
  compare_at_item_subtotal: number
  compare_at_item_tax_total: number

  original_item_total: number
  original_item_subtotal: number
  original_item_tax_total: number

  item_total: number
  item_subtotal: number
  item_tax_total: number

  original_total: number
  original_subtotal: number
  original_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number

  shipping_total: number
  shipping_subtotal: number
  shipping_tax_total: number

  original_shipping_total: number
  original_shipping_subtotal: number
  original_shipping_tax_total: number

  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | null
}

export interface FilterableCartProps
  extends BaseFilterable<FilterableCartProps> {
  id?: string | string[]

  sales_channel_id?: string | string[] | OperatorMap<string>
  customer_id?: string | string[] | OperatorMap<string>
  region_id?: string | string[] | OperatorMap<string>

  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export type legacy_CartDTO = {
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
