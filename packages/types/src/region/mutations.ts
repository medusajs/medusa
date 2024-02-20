export interface CreateRegionDTO {
  name: string
  currency_code: string
  countries?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdateRegionDTO {
  id: string
  name?: string
  currency_code?: string
  countries?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdatableRegionFields {
  name?: string
  currency_code?: string
  countries?: string[]
  metadata?: Record<string, unknown>
}
