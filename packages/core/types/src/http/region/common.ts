import { BaseFilterable, OperatorMap } from "../../dal"
import { AdminPaymentProvider } from "../payment"

export interface BaseRegion {
  /**
   * The region's ID.
   */
  id: string
  /**
   * The region's name.
   */
  name: string
  /**
   * The region's currency code.
   */
  currency_code: string
  /**
   * Whether taxes are calculated automatically in the region.
   */
  automatic_taxes?: boolean
  /**
   * The countries that belong to the region.
   */
  countries?: BaseRegionCountry[]
  /**
   * The payment providers enabled in the region.
   */
  payment_providers?: AdminPaymentProvider[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any> | null
  /**
   * The date the region was created.
   */
  created_at?: string
  /**
   * The date the region was updated.
   */
  updated_at?: string
}

export interface BaseRegionCountry {
  /**
   * The country's ID.
   */
  id: string
  /**
   * The country's ISO 2 code.
   * 
   * @example us
   */
  iso_2?: string
  /**
   * The country's ISO 3 code.
   * 
   * @example usa
   */
  iso_3?: string
  /**
   * The country's num code.
   * 
   * @example 840
   */
  num_code?: string
  /**
   * The country's name.
   */
  name?: string
  /**
   * The country's name used for display.
   */
  display_name?: string
}

export interface BaseRegionFilters extends BaseFilterable<BaseRegionFilters> {
  /**
   * A query or keywords to search a region's searchable fields by.
   */
  q?: string
  /**
   * Filter by region ID(s).
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by region name(s).
   */
  name?: string | string[]
  /**
   * Filter by currency code(s).
   */
  currency_code?: string | string[]
  /**
   * Apply filters on the region's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the region's update date.
   */
  updated_at?: OperatorMap<string>
}

export interface BaseRegionCountryFilters
  extends BaseFilterable<BaseRegionCountryFilters> {
  id?: string[] | string
  iso_2?: string[] | string
  iso_3?: string[] | string
  num_code?: string | string[]
  name?: string[] | string
  display_name?: string[] | string
}
