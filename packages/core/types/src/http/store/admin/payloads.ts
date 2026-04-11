/**
 * The details of a supported currency in a store.
 */
export interface AdminUpdateStoreSupportedCurrency {
  /**
   * The currency's ISO 3 code.
   *
   * @example
   * usd
   */
  currency_code: string
  /**
   * Whether this currency is the default currency in the store.
   */
  is_default?: boolean
  /**
   * Whether prices in this currency are tax inclusive.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing).
   */
  is_tax_inclusive?: boolean
}

export interface AdminUpdateStoreSupportedLocale {
  /**
   * The locale's BCP 47 language tag.
   * 
   * @example
   * "en-US"
   */
  locale_code: string
}

/**
 * The data to update in a store.
 */
export interface AdminUpdateStore {
  /**
   * The name of the store.
   */
  name?: string
  /**
   * The supported currencies of the store.
   */
  supported_currencies?: AdminUpdateStoreSupportedCurrency[]
  /**
   * The supported locales of the store.
   * 
   * @since 2.12.3
   */
  supported_locales?: AdminUpdateStoreSupportedLocale[]
  /**
   * The ID of the default sales channel of the store.
   */
  default_sales_channel_id?: string | null
  /**
   * The ID of the default region of the store.
   */
  default_region_id?: string | null
  /**
   * The ID of the default stock location of the store.
   */
  default_location_id?: string | null
  /**
   * Custom key-value pairs to store custom data in the store.
   */
  metadata?: Record<string, any> | null
}
