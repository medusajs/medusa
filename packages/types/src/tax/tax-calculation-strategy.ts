// import {
//   Address,
//   Customer,
//   LineItem,
//   LineItemTaxLine,
//   Region,
//   ShippingMethod,
//   ShippingMethodTaxLine,
// } from "@medusajs/medusa"
import { LineAllocationsMap } from "./common"

export type TaxCalculationContext = {
  shipping_address: any // Address | null
  customer: any // Customer
  region: any // Region
  is_return: boolean
  shipping_methods: any // ShippingMethod[]
  allocation_map: LineAllocationsMap
  tax_calculation_strategy: ITaxCalculationStrategy
}

export interface ITaxCalculationStrategy {
  /**
   * Calculates the tax amount for a given set of line items under applicable
   * tax conditions and calculation contexts.
   * @param items - the line items to calculate the tax total for
   * @param taxLines - the tax lines that applies to the calculation
   * @param calculationContext - other details relevant for the calculation
   * @return the tax total
   */
  calculate(
    items: any, // LineItem[],
    // taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
    taxLines: any[],
    calculationContext: TaxCalculationContext
  ): Promise<number>
}

export function isTaxCalculationStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is ITaxCalculationStrategy {
  return typeof object.calculate === "function"
}
