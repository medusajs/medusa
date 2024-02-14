import { RegionCurrencyDTO } from "./common"

export interface CreateRegionDTO {
  name: string
  currency_code: string
  currency?: RegionCurrencyDTO
  countries?: string[]
  tax_code?: string
  tax_rate?: number
  tax_provider_id?: string
}

export interface UpdateRegionDTO {
  id: string
  currency_code?: string
  currency?: RegionCurrencyDTO
  countries: string[]
  name?: string
  tax_code?: string
  tax_rate?: number
  tax_provider_id?: string
}

export interface AddCountryToRegionDTO {
  region_id: string
  country_id: string
}

export interface RemoveCountryFromRegionDTO extends AddCountryToRegionDTO {}
