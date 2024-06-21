import {
  BaseRegion,
  BaseRegionCountry,
  BaseRegionCountryFilters,
  BaseRegionFilters,
} from "./common"

export interface AdminRegion extends BaseRegion {}
export interface AdminRegionCountry extends BaseRegionCountry {}
export interface AdminRegionFilters extends BaseRegionFilters {}
export interface AdminRegionCountryFilters extends BaseRegionCountryFilters {}

export interface AdminCreateRegion {
  name: string
  currency_code: string
  countries?: string[]
  automatic_taxes?: boolean
  is_tax_inclusive?: boolean
  payment_providers?: string[]
  metadata?: Record<string, any>
}

export interface AdminUpdateRegion {
  name?: string
  currency_code?: string
  countries?: string[]
  automatic_taxes?: boolean
  is_tax_inclusive?: boolean
  payment_providers?: string[]
  metadata?: Record<string, any>
}
