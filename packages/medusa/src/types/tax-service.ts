export type TaxServiceRate = {
  rate?: number
  name: string
  code: string
}

export type ProviderTaxLine = {
  rate?: number
  name: string
  code: string
  item_id: string
  metadata?: JSON
}
