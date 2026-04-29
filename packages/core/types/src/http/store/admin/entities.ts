import { AdminCurrency } from "../../currency"
import { AdminLocale } from "../../locale"

export interface AdminStoreCurrency {
  /**
   * The currency's ID.
   */
  id: string
  /**
   * The currency code.
   *
   * @example
   * "usd"
   */
  currency_code: string
  /**
   * The ID of the store that the currency belongs to.
   */
  store_id: string
  /**
   * Whether the currency is the default currency for the store.
   */
  is_default: boolean
  /**
   * The currency's details.
   */
  currency: AdminCurrency
  /**
   * The date the currency was created.
   */
  created_at: string
  /**
   * The date the currency was updated.
   */
  updated_at: string
  /**
   * The date the currency was deleted.
   */
  deleted_at: string | null
}

export interface AdminStoreLocale {
  /**
   * The locale's ID.
   */
  id: string
  /**
   * The locale's code.
   *
   * @example
   * "en-US"
   */
  locale_code: string
  /**
   * The ID of the store that the locale belongs to.
   */
  store_id: string
  /**
   * The locale's details.
   */
  locale: AdminLocale
  /**
   * The date the locale was created.
   */
  created_at: string
  /**
   * The date the locale was updated.
   */
  updated_at: string
  /**
   * The date the locale was deleted.
   */
  deleted_at: string | null
}

export interface AdminStore {
  /**
   * The store's ID.
   */
  id: string
  /**
   * The store's name.
   */
  name: string
  /**
   * The store's supported currencies.
   */
  supported_currencies: AdminStoreCurrency[]
  /**
   * The store's supported locales.
   */
  supported_locales: AdminStoreLocale[]
  /**
   * The store's default sales channel ID.
   */
  default_sales_channel_id: string | null
  /**
   * The store's default region ID.
   */
  default_region_id: string | null
  /**
   * The store's default location ID.
   */
  default_location_id: string | null
  /**
   * Custom key-value pairs that can be added to the store.
   */
  metadata: Record<string, any> | null
  /**
   * The date the store was created.
   */
  created_at: string
  /**
   * The date the store was updated.
   */
  updated_at: string
}
