export interface AdminCreateRegion {
  name: string
  currency_code: string
  countries?: string[]
  automatic_taxes?: boolean
  is_tax_inclusive?: boolean
  payment_providers?: string[]
  metadata?: Record<string, any>
}

export interface AdminUpdateRegion {
  name?: string
  currency_code?: string
  countries?: string[]
  automatic_taxes?: boolean
  is_tax_inclusive?: boolean
  payment_providers?: string[]
  metadata?: Record<string, any>
}
