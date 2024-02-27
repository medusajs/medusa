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

export interface UpsertRegionDTO {
  /**
   * The id of the region in the case of an update
   */
  id?: string
  /**
   * The target name of the region
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

export interface UpdateRegionDTO {
  /**
   * The target name of the region
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
