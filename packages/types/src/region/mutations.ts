export interface CreateRegionDTO {
  name: string
  currency_code: string
  countries?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdateRegionDTO {
  id: string
  currency_code?: string
  countries?: string[]
  name?: string
  metadata?: Record<string, unknown>
}

export interface UpdatableRegionFields {
  currency_code?: string
  name?: string
  metadata?: Record<string, unknown>
}

export interface AddCountryToRegionDTO {
  region_id: string
  country_id: string
}

export interface RemoveCountryFromRegionDTO extends AddCountryToRegionDTO {}
