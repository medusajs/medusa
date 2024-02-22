import { RegionCurrencyDTO } from "./common"

/**
 * The region to be created.
 */
export interface CreateRegionDTO {
  /**
   * The name of the region.
   */
  name: string
  /**
   * The currency code of the region.
   */
  currency_code: string
  /**
   * The region's countries.
   */
  countries?: string[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The attributes to update in the region.
 */
export interface UpdateRegionDTO {
  /**
   * The ID of the region.
   */
  id: string
  /**
   * The name of the region.
   */
  name?: string
  /**
   * The currency code of the region.
   */
  currency_code?: string
  /**
   * The region's countries.
   */
  countries?: string[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * The updatable fields of a region.
 */
export interface UpdatableRegionFields {
  /**
   * The name of the region.
   */
  name?: string
  /**
   * The currency code of the region.
   */
  currency_code?: string
  /**
   * The region's countries.
   */
  countries?: string[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}
