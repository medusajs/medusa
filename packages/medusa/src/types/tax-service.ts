export type TaxServiceRate = {
  rate?: number | null
  name: string
  code: string | null
}

export type ProviderTaxLine = {
  rate: number
  name: string
  code: string | null
  item_id: string
  metadata?: JSON
}
