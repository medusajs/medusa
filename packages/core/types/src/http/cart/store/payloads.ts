export interface StoreCreateCart {
  /**
   * The ID of the region that the cart is created in.
   */
  region_id?: string
  /**
   * The cart's shipping address.
   */
  shipping_address?: StoreAddAddress
  /**
   * The cart's billing address.
   */
  billing_address?: StoreAddAddress
  /**
   * The email of the customer associated with the cart.
   */
  email?: string
  /**
   * The cart's currency code. If not provided, the region's currency
   * code is used.
   */
  currency_code?: string
  /**
   * The cart's items.
   */
  items?: StoreAddCartLineItem[]
  /**
   * The ID of the associated sales channel. Only products in the same sales channel
   * can be added to the cart.
   */
  sales_channel_id?: string
  /**
   * The promotion codes to apply on the cart.
   */
  promo_codes?: string[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCart {
  /**
   * The ID of the region that the cart is in.
   */
  region_id?: string
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
  email?: string
  /**
   * The ID of the associated sales channel. Only products in the same sales channel
   * can be added to the cart.
   */
  sales_channel_id?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The promotion codes to apply on the cart.
   */
  promo_codes?: string[]
}

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
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCartLineItem {
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
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
}
