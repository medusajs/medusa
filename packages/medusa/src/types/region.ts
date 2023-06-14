export type UpdateRegionInput = {
  name?: string
  currency_code?: string
  tax_code?: string
  tax_rate?: number
  gift_cards_taxable?: boolean
  automatic_taxes?: boolean
  tax_provider_id?: string | null
  payment_providers?: string[]
  fulfillment_providers?: string[]
  countries?: string[]
  includes_tax?: boolean
  metadata?: Record<string, unknown>
}

export type CreateRegionInput = {
  name: string
  currency_code: string
  tax_code?: string
  tax_rate: number
  payment_providers: string[]
  fulfillment_providers: string[]
  countries: string[]
  includes_tax?: boolean
  metadata?: Record<string, unknown>
}
