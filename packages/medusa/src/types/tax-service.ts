export type TaxServiceRate = {
  rate?: number | null
  name: string
  code: string | null
}

export type ProviderShippingMethodTaxLine = {
  rate: number
  name: string
  code: string | null
  metadata?: JSON
  shipping_method_id?: string
}

export type ProviderLineItemTaxLine = {
  rate: number
  name: string
  code: string | null
  item_id?: string
  metadata?: JSON
}

export type ProviderTaxLine =
  | ProviderLineItemTaxLine
  | ProviderShippingMethodTaxLine
