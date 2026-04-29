export interface AdminCreatePricePreference {
  value: string
  attribute: string
  is_tax_inclusive?: boolean | undefined
}

export interface AdminUpdatePricePreference {
  value?: string | undefined
  is_tax_inclusive?: boolean | undefined
  attribute?: string | undefined
}
