import { SelectParams } from "../../common"

/**
 * The data to create a cart.
 */
export interface StoreCreateCart {
  /**
   * The ID of the region that the cart is created in.
   * If not provided, the default region of the store is used.
   * If the store doesn't have a default region, an error is thrown.
   */
  region_id?: string | null
  /**
   * The cart's shipping address.
   */
  shipping_address?: StoreAddAddress | string
  /**
   * The cart's billing address.
   */
  billing_address?: StoreAddAddress | string
  /**
   * The email of the customer associated with the cart.
   */
  email?: string | null
  /**
   * The cart's currency code. If not provided, the region's currency
   * code is used.
   */
  currency_code?: string | null
  /**
   * The cart's items.
   */
  items?: StoreAddCartLineItem[]
  /**
   * The ID of the associated sales channel.
   *
   * A product's availability in a sales channel only filters the products you
   * retrieve. Medusa doesn't reject a variant added to the cart when its
   * product isn't available in the cart's sales channel. Learn how to enforce
   * that validation in
   * [this guide](https://docs.medusajs.com/resources/commerce-modules/cart/sales-channel-availability).
   */
  sales_channel_id?: string | null
  /**
   * The promotion codes to apply on the cart.
   */
  promo_codes?: string[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The BCP 47 language tag code of the locale.
   *
   * @since 2.12.3
   *
   * @example
   * "en-US"
   */
  locale?: string | null
}

/**
 * The data to update a cart.
 */
export interface StoreUpdateCart {
  /**
   * The ID of the region that the cart is in.
   */
  region_id?: string | null
  /**
   * The cart's shipping address.
   */
  shipping_address?: (StoreAddAddress & { id?: string }) | string
  /**
   * The cart's billing address.
   */
  billing_address?: (StoreAddAddress & { id?: string }) | string
  /**
   * The email of the customer associated with the cart.
   */
  email?: string | null
  /**
   * The ID of the associated sales channel.
   *
   * A product's availability in a sales channel only filters the products you
   * retrieve. Medusa doesn't reject a variant added to the cart when its
   * product isn't available in the cart's sales channel. Learn how to enforce
   * that validation in
   * [this guide](https://docs.medusajs.com/resources/commerce-modules/cart/sales-channel-availability).
   */
  sales_channel_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The promotion codes to apply on the cart.
   */
  promo_codes?: string[]
  /**
   * The BCP 47 language tag code of the locale.
   *
   * @since 2.12.3
   *
   * @example
   * "en-US"
   */
  locale?: string | null
}

/**
 * The data to update the customer of a cart.
 */
export interface StoreUpdateCartCustomer {}

/**
 * The data to add a line item to a cart.
 */
export interface StoreAddCartLineItem {
  /**
   * The ID of the product variant to add to the cart.
   */
  variant_id: string
  /**
   * The item's quantity in the cart.
   */
  quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update a line item in a cart.
 */
export interface StoreUpdateCartLineItem {
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The base shipping method data to add to a cart.
 *
 * @since 2.16.0
 */
export interface StoreAddCartShippingMethodsBase {
  /**
   * The id of the chosen shipping option.
   */
  option_id: string
  /**
   * Data useful for the associated fulfillment provider.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data?: Record<string, unknown>
}

/**
 * The shipping methods data to add to a cart. Can be a single method or multiple methods.
 *
 * @since 2.16.0
 */
export type StoreAddCartShippingMethods =
  | StoreAddCartShippingMethodsBase
  | StoreAddCartShippingMethodsBase[]

/**
 * The data to complete a cart and place an order.
 */
export interface StoreCompleteCart {
  /**
   * A unique key to ensure the cart completion is idempotent.
   */
  idempotency_key?: string
}

/**
 * The address data to add to a cart.
 */
export interface StoreAddAddress {
  /**
   * The first name of the address.
   */
  first_name?: string | null

  /**
   * The last name of the address.
   */
  last_name?: string | null

  /**
   * The phone number of the address.
   */
  phone?: string | null

  /**
   * The company of the address.
   */
  company?: string | null

  /**
   * The first address line of the address.
   */
  address_1?: string | null

  /**
   * The second address line of the address.
   */
  address_2?: string | null

  /**
   * The city of the address.
   */
  city?: string | null

  /**
   * The country code of the address.
   */
  country_code?: string | null

  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province/state of the address.
   */
  province?: string | null

  /**
   * The postal code of the address.
   */
  postal_code?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to remove promotion codes from a cart.
 */
export interface StoreCartRemovePromotion {
  /**
   * The promotion codes to remove from the cart.
   */
  promo_codes: string[]
}

/**
 * The data to add promotion codes to a cart.
 */
export interface StoreCartAddPromotion {
  /**
   * The promotion codes to add to the cart.
   */
  promo_codes: string[]
}

/**
 * The query parameters for calculating a cart's taxes.
 */
export interface StoreCalculateCartTaxes extends SelectParams {}
