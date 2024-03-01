import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

export interface AdjustmentLineDTO {
  /**
   * The ID of the adjustment line
   */
  id: string
  /**
   * The code of the adjustment line
   */
  code?: string
  /**
   * The amount of the adjustment line
   */
  amount: number
  /**
   * The ID of the associated cart
   */
  cart_id: string
  /**
   * The description of the adjustment line
   */
  description?: string
  /**
   * The ID of the associated promotion
   */
  promotion_id?: string
  /**
   * The ID of the associated provider
   */
  provider_id?: string
  /**
   * When the adjustment line was created
   */
  created_at: Date | string
  /**
   * When the adjustment line was updated
   */
  updated_at: Date | string
}

export interface ShippingMethodAdjustmentDTO extends AdjustmentLineDTO {
  /**
   * The associated shipping method
   */
  shipping_method: CartShippingMethodDTO
  /**
   * The ID of the associated shipping method
   */
  shipping_method_id: string
}

export interface LineItemAdjustmentDTO extends AdjustmentLineDTO {
  /**
   * The associated line item
   * @expandable
   */
  item: CartLineItemDTO
  /**
   * The associated line item
   */
  item_id: string
}

export interface TaxLineDTO {
  /**
   * The ID of the tax line
   */
  id: string
  /**
   * The description of the tax line
   */
  description?: string
  /**
   * The ID of the associated tax rate
   */
  tax_rate_id?: string
  /**
   * The code of the tax line
   */
  code: string
  /**
   * The rate of the tax line
   */
  rate: number
  /**
   * The ID of the associated provider
   */
  provider_id?: string
  /**
   * When the tax line was created
   */
  created_at: Date | string
  /**
   * When the tax line was updated
   */
  updated_at: Date | string
}

export interface ShippingMethodTaxLineDTO extends TaxLineDTO {
  /**
   * The associated shipping method
   */
  shipping_method: CartShippingMethodDTO
  /**
   * The ID of the associated shipping method
   */
  shipping_method_id: string
}

export interface LineItemTaxLineDTO extends TaxLineDTO {
  /**
   * The associated line item
   */
  item: CartLineItemDTO
  /**
   * The ID of the associated line item
   */
  item_id: string
}

export interface CartAddressDTO {
  /**
   * The ID of the address
   */
  id: string
  /**
   * The customer ID of the address
   */
  customer_id?: string
  /**
   * The first name of the address
   */
  first_name?: string
  /**
   * The last name of the address
   */
  last_name?: string
  /**
   * The phone number of the address
   */
  phone?: string
  /**
   * The company of the address
   */
  company?: string
  /**
   * The first address line of the address
   */
  address_1?: string
  /**
   * The second address line of the address
   */
  address_2?: string
  /**
   * The city of the address
   */
  city?: string
  /**
   * The country code of the address
   */
  country_code?: string
  /**
   * The province/state of the address
   */
  province?: string
  /**
   * The postal code of the address
   */
  postal_code?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the address was created.
   */
  created_at: Date | string
  /**
   * When the address was updated.
   */
  updated_at: Date | string
}

export interface CartShippingMethodDTO {
  /**
   * The ID of the shipping method
   */
  id: string

  /**
   * The ID of the associated cart
   */
  cart_id: string

  /**
   * The name of the shipping method
   */
  name: string
  /**
   * The description of the shipping method
   */
  description?: string

  /**
   * The price of the shipping method
   */
  amount: number

  /**
   * Whether the shipping method price is tax inclusive or not
   */
  is_tax_inclusive: boolean

  /**
   * The ID of the shipping option the method was created from
   */
  shipping_option_id?: string

  /**
   * Additional data needed for fulfillment.
   */
  data?: Record<string, unknown>

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The associated tax lines.
   *
   * @expandable
   */
  tax_lines?: ShippingMethodTaxLineDTO[]
  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: ShippingMethodAdjustmentDTO[]

  /**
   * When the shipping method was created.
   */
  created_at: Date | string
  /**
   * When the shipping method was updated.
   */
  updated_at: Date | string

  original_total: number
  original_subtotal: number
  original_tax_total: number

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number
}

export interface CartLineItemTotalsDTO {
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
}

export interface CartLineItemDTO extends CartLineItemTotalsDTO {
  /**
   * The ID of the line item.
   */
  id: string
  /**
   * The title of the line item.
   */
  title: string
  /**
   * The subtitle of the line item.
   */
  subtitle?: string
  /**
   * The url of the line item thumbnail.
   */
  thumbnail?: string
  /**
   * The line item quantity
   */
  quantity: number
  /**
   * The product ID of the line item.
   */
  product_id?: string
  /**
   * The product title of the line item.
   */
  product_title?: string
  /**
   * The product description of the line item.
   */
  product_description?: string
  /**
   * The product subtitle of the line item.
   */
  product_subtitle?: string
  /**
   * The product type of the line item.
   */
  product_type?: string
  /**
   * The product collection of the line item.
   */
  product_collection?: string
  /**
   * The product handle of the line item.
   */
  product_handle?: string
  /**
   * The variant ID of the line item.
   */
  variant_id?: string
  /**
   * The variant sku of the line item.
   */
  variant_sku?: string
  /**
   * The variant barcode of the line item.
   */
  variant_barcode?: string
  /**
   * The variant title of the line item.
   */
  variant_title?: string
  /**
   * The variant option values of the line item.
   */
  variant_option_values?: Record<string, unknown>
  /**
   * Whether the line item requires shipping or not
   */
  requires_shipping: boolean
  /**
   * Whether the line item is discountable or not
   */
  is_discountable: boolean
  /**
   * Whether the line item price is tax inclusive or not
   */
  is_tax_inclusive: boolean
  /**
   * The original price of the item before an adjustment or a sale.
   */
  compare_at_unit_price?: number
  /**
   * The price of the item
   */
  unit_price: number
  /**
   * The associated tax lines.
   *
   * @expandable
   */
  tax_lines?: LineItemTaxLineDTO[]
  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: LineItemAdjustmentDTO[]
  /**
   * The associated cart.
   *
   * @expandable
   */
  cart: CartDTO
  /**
   * The ID of the associated cart.
   */
  cart_id: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the line item was created.
   */
  created_at?: Date
  /**
   * When the line item was updated.
   */
  updated_at?: Date
  /**
   * When the line item was deleted.
   */
  deleted_at?: Date
}

export interface CartDTO {
  /**
   * The ID of the cart.
   */
  id: string
  /**
   * The ID of the region the cart belongs to.
   */
  region_id?: string
  /**
   * The ID of the customer on the cart.
   */
  customer_id?: string
  /**
   * The ID of the sales channel the cart belongs to.
   */
  sales_channel_id?: string
  /**
   * The email of the cart.
   */
  email?: string
  /**
   * The currency of the cart
   */
  currency_code: string
  /**
   * The associated shipping address.
   *
   * @expandable
   */
  shipping_address?: CartAddressDTO
  /**
   * The associated billing address.
   *
   * @expandable
   */
  billing_address?: CartAddressDTO
  /**
   * The associated line items.
   *
   * @expandable
   */
  items?: CartLineItemDTO[]
  /**
   * The associated shipping methods
   *
   * @expandable
   */
  shipping_methods?: CartShippingMethodDTO[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the cart was created.
   */
  created_at?: string | Date
  /**
   * When the cart was updated.
   */
  updated_at?: string | Date

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
  raw_discount_total: any
  discount_tax_total: number

  gift_card_total: number
  gift_card_tax_total: number

  shipping_total: number
  shipping_subtotal: number
  shipping_tax_total: number

  original_shipping_total: number
  original_shipping_subtotal: number
  original_shipping_tax_total: number
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

export interface FilterableAddressProps
  extends BaseFilterable<FilterableAddressProps> {
  id?: string | string[]
}

export interface FilterableLineItemProps
  extends BaseFilterable<FilterableLineItemProps> {
  id?: string | string[]
  cart_id?: string | string[]
  title?: string
  variant_id?: string | string[]
  product_id?: string | string[]
}

export interface FilterableLineItemAdjustmentProps
  extends BaseFilterable<FilterableLineItemAdjustmentProps> {
  id?: string | string[]
  item_id?: string | string[]
  promotion_id?: string | string[]
  provider_id?: string | string[]
  item?: FilterableLineItemProps
}
export interface FilterableShippingMethodProps
  extends BaseFilterable<FilterableShippingMethodProps> {
  id?: string | string[]
  cart_id?: string | string[]
  name?: string
  shipping_option_id?: string | string[]
}

export interface FilterableShippingMethodAdjustmentProps
  extends BaseFilterable<FilterableShippingMethodAdjustmentProps> {
  id?: string | string[]
  shipping_method_id?: string | string[]
  promotion_id?: string | string[]
  provider_id?: string | string[]
  shipping_method?: FilterableShippingMethodProps
}

export interface FilterableLineItemTaxLineProps
  extends BaseFilterable<FilterableLineItemTaxLineProps> {
  id?: string | string[]
  description?: string
  code?: string | string[]
  tax_rate_id?: string | string[]
  provider_id?: string | string[]
  item_id?: string | string[]
  item?: FilterableLineItemProps
}

export interface FilterableShippingMethodTaxLineProps
  extends BaseFilterable<FilterableShippingMethodTaxLineProps> {
  id?: string | string[]
  description?: string
  code?: string | string[]
  tax_rate_id?: string | string[]
  provider_id?: string | string[]
  shipping_method_id?: string | string[]
  shipping_method?: FilterableShippingMethodProps
}

/**
 * TODO: Remove this in favor of CartDTO, when module is released
 * @deprecated Use CartDTO instead
 */
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
