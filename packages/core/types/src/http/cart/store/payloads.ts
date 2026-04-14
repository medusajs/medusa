import { SelectParams } from "../../common"

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
   * The ID of the associated sales channel. Only products in the same sales channel
   * can be added to the cart.
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
   * The ID of the associated sales channel. Only products in the same sales channel
   * can be added to the cart.
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

export interface StoreUpdateCartCustomer {}

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

export interface StoreAddCartShippingMethods {
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

export interface StoreCompleteCart {
  idempotency_key?: string
}

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

export interface StoreCartRemovePromotion {
  /**
   * The promotion codes to remove from the cart.
   */
  promo_codes: string[]
}

export interface StoreCartAddPromotion {
  /**
   * The promotion codes to add to the cart.
   */
  promo_codes: string[]
}

export interface StoreCalculateCartTaxes extends SelectParams {}
