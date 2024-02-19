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

export interface CreateShippingTaxRateDTO {
  shipping_option_id: string
  tax_rate: Omit<CreateTaxRateDTO, "is_default">
}

export interface CreateProductTaxRateDTO {
  product_id: string
  tax_rate: Omit<CreateTaxRateDTO, "is_default">
}

export interface CreateProductTypeTaxRateDTO {
  product_type_id: string
  tax_rate: Omit<CreateTaxRateDTO, "is_default">
}
