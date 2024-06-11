export interface AdminCreateTaxRegion {
  country_code: string
  province_code?: string
  parent_id?: string
  default_tax_rate?: {
    rate?: number
    code?: string
    name: string
    is_combinable?: boolean
    metadata?: Record<string, unknown>
  }
  metadata?: Record<string, unknown>
}
