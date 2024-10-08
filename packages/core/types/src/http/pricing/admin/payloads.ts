export interface AdminCreatePricePreference {
  attribute?: string
  value?: string
  is_tax_inclusive?: boolean
}

export interface AdminUpdatePricePreference {
  attribute?: string | null
  value?: string | null
  is_tax_inclusive?: boolean
}
