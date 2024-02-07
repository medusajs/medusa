import { BaseFilterable } from "../dal"

export interface RegionDTO {
  id: string
  name: string
  currency_code: string
  currency: RegionCurrencyDTO
  countries: CountryDTO[]
}

export interface CountryDTO {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
}

export interface FilterableRegionProps
  extends BaseFilterable<FilterableRegionProps> {
  id?: string[]
  name?: string[]
}

export interface RegionCountryDTO {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
}

export interface RegionCurrencyDTO {
  code: string
  symbol: string
  name: string
  symbol_native: string
}

export interface FilterableRegionCurrencyProps
  extends BaseFilterable<FilterableRegionCurrencyProps> {
  id?: string[] | string
  code?: string[] | string
  symbol?: string[] | string
  name?: string[] | string
  symbol_native?: string[] | string
}

export interface FilterableRegionCountryProps
  extends BaseFilterable<FilterableRegionCountryProps> {
  id?: string[] | string
  iso_2?: string[] | string
  iso_3?: string[] | string
  num_code?: number[] | string
  name?: string[] | string
  display_name?: string[] | string
}
