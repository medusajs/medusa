import { LineItemTaxLine, ShippingMethodTaxLine } from "../models"

export type TaxLinesMaps = {
  lineItemsTaxLines: { [lineItemId: string]: LineItemTaxLine[] }
  shippingMethodsTaxLines: {
    [shippingMethodId: string]: ShippingMethodTaxLine[]
  }
}

/**
 * The tax rate object as configured in Medusa. These may have an unspecified
 * numerical rate as they may be used for lookup purposes in the tax provider
 * plugin.
 */
export type TaxServiceRate = {
  /**
   * The tax rate.
   */
  rate?: number | null
  /**
   * The tax rate's name.
   */
  name: string
  /**
   * The tax rate's code.
   */
  code: string | null
}

/**
 * The tax line properties for a given shipping method.
 */
export type ProviderShippingMethodTaxLine = {
  /**
   * The tax rate.
   */
  rate: number
  /**
   * The tax rate's name.
   */
  name: string
  /**
   * The tax code.
   */
  code: string | null
  /**
   * Holds any necessary additional data to be added to the shipping method tax lines.
   */
  metadata?: Record<string, unknown>
  /**
   * The shipping method's ID.
   */
  shipping_method_id: string
}

/**
 * The tax line properties for a given line item.
 */
export type ProviderLineItemTaxLine = {
  /**
   * The tax rate.
   */
  rate: number
  /**
   * The tax rate's name.
   */
  name: string
  /**
   * The tax code.
   */
  code: string | null
  /**
   * The line item's ID.
   */
  item_id: string
  /**
   * Holds any necessary additional data to be added to the line item tax lines.
   */
  metadata?: Record<string, unknown>
}

/**
 * A union type of the possible provider tax lines.
 */
export type ProviderTaxLine =
  | ProviderLineItemTaxLine
  | ProviderShippingMethodTaxLine
