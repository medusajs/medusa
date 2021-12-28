/**
 * The tax rate object as configured in Medusa. These may have an unspecified
 * numerical rate as they may be used for lookup purposes in the tax provider
 * plugin.
 */
export type TaxServiceRate = {
  rate?: number | null
  name: string
  code: string | null
}

/**
 * The tax line properties for a given shipping method.
 */
export type ProviderShippingMethodTaxLine = {
  rate: number
  name: string
  code: string | null
  metadata?: JSON
  shipping_method_id: string
}

/**
 * The tax line properties for a given line item.
 */
export type ProviderLineItemTaxLine = {
  rate: number
  name: string
  code: string | null
  item_id: string
  metadata?: JSON
}

/**
 * A union type of the possible provider tax lines.
 */
export type ProviderTaxLine =
  | ProviderLineItemTaxLine
  | ProviderShippingMethodTaxLine
