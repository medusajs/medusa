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
  supported_currency_codes?: string[]

  /**
   * The default currency code of the store.
   */
  default_currency_code?: string

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
export interface UpsertStoreDTO {
  /**
   * The ID of the store.
   */
  id?: string

  /**
   * The name of the store.
   */
  name?: string

  /**
   * The supported currency codes of the store.
   */
  supported_currency_codes?: string[]

  /**
   * The default currency code of the store.
   */
  default_currency_code?: string

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
  supported_currency_codes?: string[]

  /**
   * The default currency code of the store.
   */
  default_currency_code?: string

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
