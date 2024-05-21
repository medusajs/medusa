import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { BigNumberRawValue, BigNumberValue } from "../totals"

/**
 * The adjustment line details.
 */
export interface AdjustmentLineDTO {
  /**
   * The ID of the adjustment line
   */
  id: string

  /**
   * The code of the promotion that lead to
   * this adjustment.
   */
  code?: string

  /**
   * The amount to adjust the original amount with.
   */
  amount: BigNumberValue

  /**
   * The raw amount to adjust the original amount with.
   */
  raw_amount: BigNumberRawValue

  /**
   * The ID of the associated cart.
   */
  cart_id: string

  /**
   * The description of the adjustment line.
   */
  description?: string

  /**
   * The ID of the associated promotion.
   */
  promotion_id?: string

  /**
   * The ID of the associated provider.
   */
  provider_id?: string

  /**
   * When the adjustment line was created.
   */
  created_at: Date | string

  /**
   * When the adjustment line was updated.
   */
  updated_at: Date | string
}

/**
 * The shipping method adjustment details.
 */
export interface ShippingMethodAdjustmentDTO extends AdjustmentLineDTO {
  /**
   * The associated shipping method.
   */
  shipping_method: CartShippingMethodDTO

  /**
   * The ID of the associated shipping method.
   */
  shipping_method_id: string
}

/**
 * The line item adjustment details.
 */
export interface LineItemAdjustmentDTO extends AdjustmentLineDTO {
  /**
   * The associated line item.
   *
   * @expandable
   */
  item: CartLineItemDTO

  /**
   * The ID of the associated line item.
   */
  item_id: string
}

/**
 * The tax line details.
 */
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
   * The ID of the associated tax rate.
   */
  tax_rate_id?: string

  /**
   * The code of the tax line.
   */
  code: string

  /**
   * The rate of the tax line.
   */
  rate: number

  /**
   * The ID of the associated provider.
   */
  provider_id?: string

  /**
   * When the tax line was created.
   */
  created_at: Date | string

  /**
   * When the tax line was updated.
   */
  updated_at: Date | string
}

/**
 * The shipping method tax line details.
 */
export interface ShippingMethodTaxLineDTO extends TaxLineDTO {
  /**
   * The associated shipping method.
   */
  shipping_method: CartShippingMethodDTO

  /**
   * The ID of the associated shipping method.
   */
  shipping_method_id: string

  /**
   * The total tax relative to the shipping method.
   */
  total: BigNumberValue

  /**
   * The subtotal tax relative to the shipping method.
   */
  subtotal: BigNumberValue

  /**
   * The raw total tax relative to the shipping method.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal tax relative to the shipping method.
   */
  raw_subtotal: BigNumberRawValue
}

/**
 * The line item tax line details.
 */
export interface LineItemTaxLineDTO extends TaxLineDTO {
  /**
   * The associated line item.
   */
  item: CartLineItemDTO

  /**
   * The ID of the associated line item.
   */
  item_id: string

  /**
   * The total tax relative to the item.
   */
  total: BigNumberValue

  /**
   * The subtotal tax relative to the item.
   */
  subtotal: BigNumberValue

  /**
   * The raw total tax relative to the item.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal tax relative to the item.
   */
  raw_subtotal: BigNumberRawValue
}

/**
 * The cart address details.
 */
export interface CartAddressDTO {
  /**
   * The ID of the address.
   */
  id: string

  /**
   * The customer ID of the address.
   */
  customer_id?: string

  /**
   * The first name of the address.
   */
  first_name?: string

  /**
   * The last name of the address.
   */
  last_name?: string

  /**
   * The phone number of the address.
   */
  phone?: string

  /**
   * The company of the address.
   */
  company?: string

  /**
   * The first address line of the address.
   */
  address_1?: string

  /**
   * The second address line of the address.
   */
  address_2?: string

  /**
   * The city of the address.
   */
  city?: string

  /**
   * The country code of the address.
   */
  country_code?: string

  /**
   * The province/state of the address.
   */
  province?: string

  /**
   * The postal code of the address.
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

/**
 * The cart shipping method details.
 */
export interface CartShippingMethodDTO {
  /**
   * The ID of the shipping method.
   */
  id: string

  /**
   * The ID of the associated cart.
   */
  cart_id: string

  /**
   * The name of the shipping method.
   */
  name: string

  /**
   * The description of the shipping method.
   */
  description?: string

  /**
   * The price of the shipping method.
   */
  amount: BigNumberValue

  /**
   * Whether the shipping method price is tax inclusive.
   */
  is_tax_inclusive: boolean

  /**
   * The ID of the shipping option the method was created from.
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

  /**
   * The original total of the cart shipping method.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the cart shipping method.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the cart shipping method.
   */
  original_tax_total: BigNumberValue

  /**
   * The total of the cart shipping method.
   */
  total: BigNumberValue

  /**
   * The subtotal of the cart shipping method.
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the cart shipping method.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the cart shipping method.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the cart shipping method.
   */
  discount_tax_total: BigNumberValue

  /**
   * The raw original total of the cart shipping method.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the cart shipping method.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the cart shipping method.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the cart shipping method.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the cart shipping method.
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the cart shipping method.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the cart shipping method.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the cart shipping method.
   */
  raw_discount_tax_total: BigNumberRawValue
}

/**
 * The cart line item totals details.
 */
export interface CartLineItemTotalsDTO {
  /**
   * The original total of the cart line item.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the cart line item.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the cart line item.
   */
  original_tax_total: BigNumberValue

  /**
   * The item total of the cart line item.
   */
  item_total: BigNumberValue

  /**
   * The item subtotal of the cart line item.
   */
  item_subtotal: BigNumberValue

  /**
   * The item tax total of the cart line item.
   */
  item_tax_total: BigNumberValue

  /**
   * The total of the cart line item.
   */
  total: BigNumberValue

  /**
   * The subtotal of the cart line item.
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the cart line item.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the cart line item.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the cart line item.
   */
  discount_tax_total: BigNumberValue

  /**
   * The raw original total of the cart line item.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the cart line item.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the cart line item.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw item total of the cart line item.
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the cart line item.
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the cart line item.
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw total of the cart line item.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the cart line item.
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the cart line item.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the cart line item.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the cart line item.
   */
  raw_discount_tax_total: BigNumberRawValue
}

/**
 * The cart line item details.
 */
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
   * The line item's thumbnail.
   */
  thumbnail?: string

  /**
   * The line item's quantity in the cart.
   */
  quantity: BigNumberValue

  /**
   * The ID of the associated product.
   */
  product_id?: string

  /**
   * The title of the associated product.
   */
  product_title?: string

  /**
   * The description of the associated product.
   */
  product_description?: string

  /**
   * The subtitle of the associated product.
   */
  product_subtitle?: string

  /**
   * The type of the associated product.
   */
  product_type?: string

  /**
   * The collection of the associated product.
   */
  product_collection?: string

  /**
   * The handle of the associated product.
   */
  product_handle?: string

  /**
   * The associated variant's ID of the line item.
   */
  variant_id?: string

  /**
   * The sku of the associated variant.
   */
  variant_sku?: string

  /**
   * The barcode of the associated variant.
   */
  variant_barcode?: string

  /**
   * The title of the associated variant.
   */
  variant_title?: string

  /**
   * The option values of the associated variant.
   */
  variant_option_values?: Record<string, unknown>

  /**
   * Whether the line item requires shipping.
   */
  requires_shipping: boolean

  /**
   * Whether the line item is discountable.
   */
  is_discountable: boolean

  /**
   * Whether the line item price is tax inclusive.
   */
  is_tax_inclusive: boolean

  /**
   * The calculated price of the line item.
   */
  compare_at_unit_price?: BigNumberValue

  /**
   * The unit price of the item.
   */
  unit_price: BigNumberValue

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

/**
 * The cart details.
 */
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
   * The ID of the associated customer
   */
  customer_id?: string

  /**
   * The ID of the sales channel the cart belongs to.
   */
  sales_channel_id?: string

  /**
   * The email of the customer that owns the cart.
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

  /**
   * The original item total of the cart.
   */
  original_item_total: BigNumberValue

  /**
   * The original item subtotal of the cart.
   */
  original_item_subtotal: BigNumberValue

  /**
   * The original item tax total of the cart.
   */
  original_item_tax_total: BigNumberValue

  /**
   * The item total of the cart.
   */
  item_total: BigNumberValue

  /**
   * The item subtotal of the cart.
   */
  item_subtotal: BigNumberValue

  /**
   * The item tax total of the cart.
   */
  item_tax_total: BigNumberValue

  /**
   * The original total of the cart.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the cart.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the cart.
   */
  original_tax_total: BigNumberValue

  /**
   * The total of the cart.
   */
  total: BigNumberValue

  /**
   * The subtotal of the cart. (Excluding taxes)
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the cart.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the cart.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the cart.
   */
  discount_tax_total: BigNumberValue

  /**
   * The gift card total of the cart.
   */
  gift_card_total: BigNumberValue

  /**
   * The gift card tax total of the cart.
   */
  gift_card_tax_total: BigNumberValue

  /**
   * The shipping total of the cart.
   */
  shipping_total: BigNumberValue

  /**
   * The shipping subtotal of the cart.
   */
  shipping_subtotal: BigNumberValue

  /**
   * The shipping tax total of the cart.
   */
  shipping_tax_total: BigNumberValue

  /**
   * The original shipping total of the cart.
   */
  original_shipping_total: BigNumberValue

  /**
   * The original shipping subtotal of the cart.
   */
  original_shipping_subtotal: BigNumberValue

  /**
   * The original shipping tax total of the cart.
   */
  original_shipping_tax_total: BigNumberValue

  /**
   * The raw original item total of the cart.
   */
  raw_original_item_total: BigNumberRawValue

  /**
   * The raw original item subtotal of the cart.
   */
  raw_original_item_subtotal: BigNumberRawValue

  /**
   * The raw original item tax total of the cart.
   */
  raw_original_item_tax_total: BigNumberRawValue

  /**
   * The raw item total of the cart.
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the cart.
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the cart.
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw original total of the cart.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the cart.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the cart.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the cart.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the cart. (Excluding taxes)
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the cart.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the cart.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the cart.
   */
  raw_discount_tax_total: BigNumberRawValue

  /**
   * The raw gift card total of the cart.
   */
  raw_gift_card_total: BigNumberRawValue

  /**
   * The raw gift card tax total of the cart.
   */
  raw_gift_card_tax_total: BigNumberRawValue

  /**
   * The raw shipping total of the cart.
   */
  raw_shipping_total: BigNumberRawValue

  /**
   * The raw shipping subtotal of the cart.
   */
  raw_shipping_subtotal: BigNumberRawValue

  /**
   * The raw shipping tax total of the cart.
   */
  raw_shipping_tax_total: BigNumberRawValue

  /**
   * The raw original shipping total of the cart.
   */
  raw_original_shipping_total: BigNumberRawValue

  /**
   * The raw original shipping subtotal of the cart.
   */
  raw_original_shipping_subtotal: BigNumberRawValue

  /**
   * The raw original shipping tax total of the cart.
   */
  raw_original_shipping_tax_total: BigNumberRawValue
}

/**
 * The filters to apply on the retrieved carts.
 */
export interface FilterableCartProps
  extends BaseFilterable<FilterableCartProps> {
  /**
   * The IDs to filter the carts by.
   */
  id?: string | string[]

  /**
   * Filter the carts by the ID of their associated sales channel.
   */
  sales_channel_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the carts by the ID of their associated customer.
   */
  customer_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the carts by the ID of their associated region.
   */
  region_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the carts by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the carts by their update date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved addresss.
 */
export interface FilterableAddressProps
  extends BaseFilterable<FilterableAddressProps> {
  /**
   * The IDs to filter the addresss by.
   */
  id?: string | string[]
}

/**
 * The filters to apply on the retrieved line items.
 */
export interface FilterableLineItemProps
  extends BaseFilterable<FilterableLineItemProps> {
  /**
   * The IDs to filter the line items by.
   */
  id?: string | string[]

  /**
   * Filter the line items by the ID of their associated cart.
   */
  cart_id?: string | string[]

  /**
   * Filter the line items by their title.
   */
  title?: string

  /**
   * Filter the line items by the ID of their associated variant.
   */
  variant_id?: string | string[]

  /**
   * Filter the line items by the ID of their associated product.
   */
  product_id?: string | string[]
}

/**
 * The filters to apply on the retrieved line item adjustments.
 */
export interface FilterableLineItemAdjustmentProps
  extends BaseFilterable<FilterableLineItemAdjustmentProps> {
  /**
   * The IDs to filter the line item adjustments by.
   */
  id?: string | string[]

  /**
   * Filter the adjustments by the ID of their associated line item.
   */
  item_id?: string | string[]

  /**
   * Filter the line item adjustments by the ID of their associated promotion.
   */
  promotion_id?: string | string[]

  /**
   * Filter the line item adjustments by the ID of their associated provider.
   */
  provider_id?: string | string[]

  /**
   * Filter the adjustments by their associated line item.
   */
  item?: FilterableLineItemProps
}

/**
 * The filters to apply on the retrieved shipping methods.
 */
export interface FilterableShippingMethodProps
  extends BaseFilterable<FilterableShippingMethodProps> {
  /**
   * The IDs to filter the shipping methods by.
   */
  id?: string | string[]

  /**
   * Filter the shipping methods by the ID of their associated cart.
   */
  cart_id?: string | string[]

  /**
   * Filter the shipping methods by their name.
   */
  name?: string

  /**
   * Filter the shipping methods by the ID of their associated shipping option.
   */
  shipping_option_id?: string | string[] | OperatorMap<string>
}

/**
 * The filters to apply on the retrieved shipping method adjustments.
 */
export interface FilterableShippingMethodAdjustmentProps
  extends BaseFilterable<FilterableShippingMethodAdjustmentProps> {
  /**
   * The IDs to filter the shipping method adjustments by.
   */
  id?: string | string[]

  /**
   * Filter the adjustments by the ID of their associated shipping method.
   */
  shipping_method_id?: string | string[]

  /**
   * Filter the shipping method adjustments by the ID of their associated promotion.
   */
  promotion_id?: string | string[]

  /**
   * Filter the shipping method adjustments by the ID of their associated provider.
   */
  provider_id?: string | string[]

  /**
   * Filter the adjustments by their associated shipping method.
   */
  shipping_method?: FilterableShippingMethodProps
}

/**
 * The filters to apply on the retrieved line item tax lines.
 */
export interface FilterableLineItemTaxLineProps
  extends BaseFilterable<FilterableLineItemTaxLineProps> {
  /**
   * The IDs to filter the line item tax lines by.
   */
  id?: string | string[]

  /**
   * Filter the line item tax lines by their description.
   */
  description?: string

  /**
   * Filter the line item tax lines by their code.
   */
  code?: string | string[]

  /**
   * Filter the line item tax lines by the ID of their associated tax rate.
   */
  tax_rate_id?: string | string[]

  /**
   * Filter the line item tax lines by the ID of their associated provider.
   */
  provider_id?: string | string[]

  /**
   * Filter the tax lines by the ID of their associated line item.
   */
  item_id?: string | string[]

  /**
   * Filter the tax lines by their associated line item.
   */
  item?: FilterableLineItemProps
}

/**
 * The filters to apply on the retrieved shipping method tax lines.
 */
export interface FilterableShippingMethodTaxLineProps
  extends BaseFilterable<FilterableShippingMethodTaxLineProps> {
  /**
   * The IDs to filter the shipping method tax lines by.
   */
  id?: string | string[]

  /**
   * Filter the shipping method tax lines by their description.
   */
  description?: string

  /**
   * Filter the shipping method tax lines by their code.
   */
  code?: string | string[]

  /**
   * Filter the shipping method tax lines by the ID of their associated tax rate.
   */
  tax_rate_id?: string | string[]

  /**
   * Filter the shipping method tax lines by the ID of their associated provider.
   */
  provider_id?: string | string[]

  /**
   * Filter the tax lines by the ID of their associated shipping method.
   */
  shipping_method_id?: string | string[]

  /**
   * Filter the tax lines by their associated shipping method.
   */
  shipping_method?: FilterableShippingMethodProps
}
