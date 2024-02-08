import { BaseFilterable } from "../dal"

/**
 * The region details.
 */
export interface RegionDTO {
  /**
   * The ID of the region.
   */
  id: string

  /**
   * The name of the region.
   */
  name: string

  /**
   * The currency code of the region.
   */
  currency_code: string

  /**
   * The associated region currency.
   */
  currency: RegionCurrencyDTO

  /**
   * The countries of the region.
   */
  countries: CountryDTO[]
}

/**
 * The country details.
 */
export interface CountryDTO {
  /**
   * The ID of the country.
   */
  id: string

  /**
   * The ISO 2 code of the country.
   */
  iso_2: string

  /**
   * The ISO 3 code of the country.
   */
  iso_3: string

  /**
   * The country's code number.
   */
  num_code: number

  /**
   * The name of the country.
   */
  name: string

  /**
   * The display name of the country.
   */
  display_name: string
}

/**
 * The filters to apply on the retrieved regions.
 */
export interface FilterableRegionProps
  extends BaseFilterable<FilterableRegionProps> {
  /**
   * The IDs to filter the region by.
   */
  id?: string[]

  /**
   * Filter regions by their name.
   */
  name?: string[]
}

/**
 * The details of a region's country.
 */
export interface RegionCountryDTO {
  /**
   * The ID of the country.
   */
  id: string

  /**
   * The ISO 2 code of the country.
   */
  iso_2: string

  /**
   * The ISO 3 code of the country.
   */
  iso_3: string

  /**
   * The code number of the country.
   */
  num_code: number

  /**
   * The name of the country.
   */
  name: string

  /**
   * The display name of the country.
   */
  display_name: string
}

/**
 * The details of a region's currency
 */
export interface RegionCurrencyDTO {
  /**
   * The code of the currency.
   */
  code: string

  /**
   * The symbol of the currency.
   */
  symbol: string

  /**
   * The name of the currency.
   */
  name: string

  /**
   * The symbol native of the currency.
   */
  symbol_native: string
}

/**
 * The filters to apply on the retrieved region's currencies.
 */
export interface FilterableRegionCurrencyProps
  extends BaseFilterable<FilterableRegionCurrencyProps> {
  /**
   * The IDs to filter the currencies by.
   */
  id?: string[] | string

  /**
   * Filter currencies by their code.
   */
  code?: string[] | string

  /**
   * Filter currencies by their symbol.
   */
  symbol?: string[] | string

  /**
   * Filter currencies by their name.
   */
  name?: string[] | string

  /**
   * Filter currencies by their native symbol.
   */
  symbol_native?: string[] | string
}

/**
 * The filters to apply on the retrieved region's countries.
 */
export interface FilterableRegionCountryProps
  extends BaseFilterable<FilterableRegionCountryProps> {
  /**
   * The IDs to filter the countries by.
   */
  id?: string[] | string

  /**
   * Filter countries by their ISO 2 code.
   */
  iso_2?: string[] | string

  /**
   * Filter countries by their ISO 3 code.
   */
  iso_3?: string[] | string

  /**
   * Filter countries by their code number.
   */
  num_code?: number[] | string

  /**
   * Filter countries by their name.
   */
  name?: string[] | string

  /**
   * Filter countries by their display name.
   */
  display_name?: string[] | string
}
