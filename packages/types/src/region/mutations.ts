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
   * The associated currency.
   */
  currency?: RegionCurrencyDTO

  /**
   * The tax code of the region.
   */
  tax_code?: string

  /**
   * The tax rate of the region.
   */
  tax_rate?: number

  /**
   * The associated tax provider's ID.
   */
  tax_provider_id?: string
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
   * The currency code of the region.
   */
  currency_code?: string

  /**
   * The associated currency.
   */
  currency?: RegionCurrencyDTO

  /**
   * The name of the region.
   */
  name?: string

  /**
   * The tax code of the region.
   */
  tax_code?: string

  /**
   * The tax rate of the region.
   */
  tax_rate?: number

  /**
   * The associated tax provider's ID.
   */
  tax_provider_id?: string
}

/**
 * The details necessary to add a country to a region.
 */
export interface AddCountryToRegionDTO {
  /**
   * The region's ID.
   */
  region_id: string

  /**
   * The country's ID.
   */
  country_id: string
}

/**
 * The details necessary to remove a country from a region.
 */
export interface RemoveCountryFromRegionDTO extends AddCountryToRegionDTO {}
