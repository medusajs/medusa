interface AdminCreateTaxRateRule {
  reference: string
  reference_id: string
}

export interface AdminCreateTaxRate {
  name: string
  tax_region_id: string
  rate?: number
  code?: string
  rules?: AdminCreateTaxRateRule[]
  is_default?: boolean
  is_combinable?: boolean
  metadata?: Record<string, unknown>
}

export interface AdminUpdateTaxRate {
  name?: string
  rate?: number
  code?: string | null
  rules?: AdminCreateTaxRateRule[]
  is_default?: boolean
  is_combinable?: boolean
  metadata?: Record<string, unknown>
}
