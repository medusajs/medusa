import { BaseFilterable, OperatorMap } from "../../dal"
import { AdminPaymentProvider } from "../payment"

export interface BaseRegion {
  id: string
  name: string
  currency_code: string
  automatic_taxes?: boolean
  is_tax_inclusive?: boolean
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
  q?: string
  id?: string[] | string | OperatorMap<string | string[]>
  name?: string | OperatorMap<string>
  currency_code?: string | OperatorMap<string>
  metadata?: Record<string, unknown> | OperatorMap<Record<string, unknown>>
  created_at?: OperatorMap<string>
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
