export interface StoreCreateCart {
  region_id?: string
  shipping_address?: StoreAddAddress
  billing_address?: StoreAddAddress
  email?: string
  currency_code?: string
  items?: StoreAddCartLineItem[]
  sales_channel_id?: string
  promo_codes?: string[]
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCart {
  region_id?: string
  shipping_address?: StoreAddAddress | string
  billing_address?: StoreAddAddress | string
  email?: string
  sales_channel_id?: string
  metadata?: Record<string, unknown>
  promo_codes?: string[]
}

export interface StoreAddCartLineItem {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown>
}

export interface StoreUpdateCartLineItem {
  quantity: number
  metadata?: Record<string, unknown>
}

export interface StoreAddCartShippingMethods {
  option_id: string
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
