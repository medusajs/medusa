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
   * The sum of all line items' original totals before discounts, including taxes.
   */
  original_item_total: number

  /**
   * The sum of all line items' original subtotals before discounts, excluding taxes.
   */
  original_item_subtotal: number

  /**
   * The sum of all line items' original tax totals before discounts.
   */
  original_item_tax_total: number

  /**
   * The sum of all line items' totals after discounts, including taxes.
   */
  item_total: number

  /**
   * The sum of all line items' subtotals before discounts, excluding taxes.
   */
  item_subtotal: number

  /**
   * The sum of all line items' tax totals after discounts.
   */
  item_tax_total: number

  /**
   * The cart's total before discounts, including taxes. Calculated as the sum of `original_item_total` and `original_shipping_total`.
   */
  original_total: number

  /**
   * The cart's subtotal before discounts, excluding taxes. Calculated as the sum of `original_item_subtotal` and `original_shipping_subtotal`.
   */
  original_subtotal: number

  /**
   * The cart's tax total before discounts. Calculated as the sum of `original_item_tax_total` and `original_shipping_tax_total`.
   */
  original_tax_total: number

  /**
   * The cart's final total after discounts and credit lines, including taxes.
   */
  total: number

  /**
   * The cart's subtotal before discounts, excluding taxes. Calculated as the sum of `item_subtotal` and `shipping_subtotal`.
   */
  subtotal: number

  /**
   * The cart's tax total after discounts. Calculated as the sum of `item_tax_total` and `shipping_tax_total`.
   */
  tax_total: number

  /**
   * The total amount of discounts applied to the cart, including the tax portion of discounts.
   */
  discount_total: number

  /**
   * The total amount of discounts applied to the cart's tax. Represents the tax portion of discounts.
   */
  discount_tax_total: number

  /**
   * The gift card total of the cart.
   */
  gift_card_total: number

  /**
   * The gift card tax total of the cart.
   */
  gift_card_tax_total: number

  /**
   * The sum of all shipping methods' totals after discounts, including taxes.
   */
  shipping_total: number

  /**
   * The sum of all shipping methods' subtotals before discounts, excluding taxes.
   */
  shipping_subtotal: number

  /**
   * The sum of all shipping methods' tax totals after discounts.
   */
  shipping_tax_total: number

  /**
   * The sum of all shipping methods' original totals before discounts, including taxes.
   */
  original_shipping_total: number

  /**
   * The sum of all shipping methods' original subtotals before discounts, excluding taxes.
   */
  original_shipping_subtotal: number

  /**
   * The sum of all shipping methods' original tax totals before discounts.
   */
  original_shipping_tax_total: number

  /**
   * The date the cart was completed.
   */
  completed_at?: string | Date
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
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province/state of the address.
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
  amount: number

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
   * The shipping method's original total before discounts, including taxes.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  original_total?: number

  /**
   * The shipping method's original subtotal before discounts, excluding taxes.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  original_subtotal?: number

  /**
   * The shipping method's original tax total before discounts.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  original_tax_total?: number

  /**
   * The shipping method's total after discounts, including taxes.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  total?: number

  /**
   * The shipping method's subtotal before discounts, excluding taxes.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  subtotal?: number

  /**
   * The shipping method's tax total after discounts.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  tax_total?: number

  /**
   * The total amount of discounts applied to the shipping method, including the tax portion of discounts.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  discount_total?: number

  /**
   * The total amount of discounts applied to the shipping method's tax. Represents the tax portion of discounts.
   * This field is only available if you expand the `shipping_methods.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-shipping-method-totals) guide.
   */
  discount_tax_total?: number
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
  quantity: number

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
  compare_at_unit_price?: number

  /**
   * The unit price of the item.
   */
  unit_price: number

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
   * The line item's original total before discounts, including taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  original_total?: number

  /**
   * The line item's original subtotal before discounts, excluding taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  original_subtotal?: number

  /**
   * The line item's original tax total before discounts.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  original_tax_total?: number

  /**
   * The line item's total after discounts, including taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  item_total?: number

  /**
   * The line item's subtotal before discounts, excluding taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  item_subtotal?: number

  /**
   * The line item's tax total after discounts.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  item_tax_total?: number

  /**
   * The line item's total after discounts, including taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  total?: number

  /**
   * The line item's subtotal before discounts, excluding taxes.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  subtotal?: number

  /**
   * The line item's tax total after discounts.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  tax_total?: number

  /**
   * The total amount of discounts applied to the line item, including the tax portion of discounts.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  discount_total?: number

  /**
   * The total amount of discounts applied to the line item's tax. Represents the tax portion of discounts.
   * This field is only available if you expand the `items.*` relation. Learn more in the
   * [Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals#retrieve-and-show-cart-item-totals) guide.
   */
  discount_tax_total?: number
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
  amount: number

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
  total: number

  /**
   * The subtotal tax relative to the shipping method.
   */
  subtotal: number
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
  total: number

  /**
   * The subtotal tax relative to the item.
   */
  subtotal: number
}
