import { BaseFilterable } from "../../dal"

/**
 * The store details.
 */
export interface StoreDTO {
  /**
   * The ID of the store.
   */
  id: string

  /**
   * The name of the store.
   */
  name: string

  /**
   * The supported currency codes of the store.
   */
  supported_currency_codes: string[]

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
  metadata: Record<string, any> | null

  /**
   * The created at of the store.
   */
  created_at: string

  /**
   * The updated at of the store.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved stores.
 */
export interface FilterableStoreProps
  extends BaseFilterable<FilterableStoreProps> {
  /**
   * Find stores by name through this search term.
   */
  q?: string
  /**
   * The IDs to filter the stores by.
   */
  id?: string | string[]

  /**
   * Filter stores by their names.
   */
  name?: string | string[]
}
