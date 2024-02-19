export interface CreateTaxRateDTO {
  tax_region_id: string
  rate?: number | null
  code?: string | null
  name: string
  is_default?: boolean
  created_by?: string
  metadata?: Record<string, unknown>
}

export interface CreateTaxRegionDTO {
  country_code: string
  province_code?: string | null
  parent_id?: string | null
  metadata?: Record<string, unknown>
  created_by?: string
  default_tax_rate: {
    rate?: number | null
    code?: string | null
    name: string
    metadata?: Record<string, unknown>
  }
}
