import { BaseFilterable, OperatorMap } from "../dal"
import { PaymentProviderDTO } from "../payment"

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
   * Setting to indicate whether taxes need to be applied automatically
   */
  automatic_taxes: boolean
  /**
   * The countries of the region.
   */
  countries: RegionCountryDTO[]
  /**
   * Payment providers available in the region
   */
  payment_providers: PaymentProviderDTO[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, any>

  /**
   * The date the region was created.
   */
  created_at: string

  /**
   * The date the region was updated.
   */
  updated_at: string
}

/**
 * The country details.
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
   * The country's code number.
   */
  num_code: string

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
   * Find regions by name through this search term
   */
  q?: string
  /**
   * The IDs to filter the regions by.
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter regions by their name.
   */
  name?: string | OperatorMap<string>

  /**
   * Filter regions by their currency code.
   */
  currency_code?: string | OperatorMap<string>

  /**
   * Filter regions by their metadata.
   */
  metadata?: Record<string, unknown> | OperatorMap<Record<string, unknown>>

  /**
   * Filter regions by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter regions by their update date.
   */
  updated_at?: OperatorMap<string>
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
  num_code?: string[] | string

  /**
   * Filter countries by their name.
   */
  name?: string[] | string

  /**
   * Filter countries by their display name.
   */
  display_name?: string[] | string
}
