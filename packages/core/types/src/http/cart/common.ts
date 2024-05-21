import { BigNumberValue } from "../../totals"
import { BasePaymentCollection } from "../payment/common"
import { BaseProduct, BaseProductVariant } from "../product/common"
import { BaseRegion } from "../region/common"

export interface BaseCart {
  /**
   * The ID of the cart.
   */
  id: string

  /**
   * The associated region.
   *
   * @expandable
   */
  region?: BaseRegion

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
  shipping_address?: BaseCartAddress

  /**
   * The associated billing address.
   *
   * @expandable
   */
  billing_address?: BaseCartAddress

  /**
   * The associated line items.
   *
   * @expandable
   */
  items?: BaseCartLineItem[]

  /**
   * The associated shipping methods
   *
   * @expandable
   */
  shipping_methods?: BaseCartShippingMethod[]

  /**
   * The associated payment collection
   *
   * @expandable
   */
  payment_collection?: BasePaymentCollection

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
}

export interface BaseCartAddress {
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
export interface BaseCartShippingMethod {
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
  tax_lines?: BaseShippingMethodTaxLine[]

  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: BaseShippingMethodAdjustment[]

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
}

/**
 * The cart line item details.
 */
export interface BaseCartLineItem extends BaseCartLineItemTotals {
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
   * The associated product with the line item.
   *
   * @expandable
   */
  product?: BaseProduct

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
   * The associated variant with the line item.
   *
   * @expandable
   */
  variant?: BaseProductVariant

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
  tax_lines?: BaseLineItemTaxLine[]

  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: BaseLineItemAdjustment[]

  /**
   * The associated cart.
   *
   * @expandable
   */
  cart: BaseCart

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
 * The cart line item totals details.
 */
export interface BaseCartLineItemTotals {
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
}

/**
 * The adjustment line details.
 */
export interface BaseAdjustmentLine {
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
export interface BaseShippingMethodAdjustment extends BaseAdjustmentLine {
  /**
   * The associated shipping method.
   */
  shipping_method: BaseCartShippingMethod

  /**
   * The ID of the associated shipping method.
   */
  shipping_method_id: string
}

/**
 * The line item adjustment details.
 */
export interface BaseLineItemAdjustment extends BaseAdjustmentLine {
  /**
   * The associated line item.
   *
   * @expandable
   */
  item: BaseCartLineItem

  /**
   * The ID of the associated line item.
   */
  item_id: string
}

/**
 * The tax line details.
 */
export interface BaseTaxLine {
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
export interface BaseShippingMethodTaxLine extends BaseTaxLine {
  /**
   * The associated shipping method.
   */
  shipping_method: BaseCartShippingMethod

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
}

/**
 * The line item tax line details.
 */
export interface BaseLineItemTaxLine extends BaseTaxLine {
  /**
   * The associated line item.
   */
  item: BaseCartLineItem

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
}
