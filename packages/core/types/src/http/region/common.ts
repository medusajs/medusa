import { BaseFilterable, OperatorMap } from "../../dal"
import { AdminPaymentProvider } from "../payment"

export interface BaseRegion {
  id: string
  name: string
  currency_code: string
  automatic_taxes?: boolean
  countries?: BaseRegionCountry[]
  payment_providers?: AdminPaymentProvider[]
  metadata?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface BaseRegionCountry {
  id: string
  iso_2?: string
  iso_3?: string
  num_code?: string
  name?: string
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
