export type RegionDTO = {
  name: string
  currency_code: string
  tax_rate?: number
  tax_code?: string | null
  gift_cards_taxable?: boolean
  automatic_taxes?: boolean
  tax_provider_id?: string | null
  metadata?: Record<string, unknown>
  includes_tax?: boolean
}
