export interface CreateStoreCurrencyDTO {
  /**
   * The currency code of the store currency.
   */
  currency_code: string
  /**
   * Whether the currency is the default one for the store.
   */
  is_default?: boolean
}

/**
 * The store to be created.
 */
export interface CreateStoreDTO {
  /**
   * The name of the store.
   */
  name?: string

  /**
   * The supported currency codes of the store.
   */
  supported_currencies?: CreateStoreCurrencyDTO[]

  /**
   * The associated default sales channel's ID.
   */
  default_sales_channel_id?: string

  /**
   * The associated default region's ID.
   */
  default_region_id?: string

  /**
   * The associated default location's ID.
   */
  default_location_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, any>
}

/**
 * The attributes in the store to be created or updated.
 */
export interface UpsertStoreDTO extends UpdateStoreDTO {
  /**
   * The ID of the store when doing an update.
   */
  id?: string
}

/**
 * The attributes to update in the store.
 */
export interface UpdateStoreDTO {
  /**
   * The name of the store.
   */
  name?: string

  /**
   * The supported currency codes of the store.
   */
  supported_currencies?: CreateStoreCurrencyDTO[]

  /**
   * The associated default sales channel's ID.
   */
  default_sales_channel_id?: string | null

  /**
   * The associated default region's ID.
   */
  default_region_id?: string | null

  /**
   * The associated default location's ID.
   */
  default_location_id?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, any> | null
}
