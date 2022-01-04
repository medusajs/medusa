import { LineItem } from "../models/line-item"
import { TaxCalculationContext } from "./tax-service"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"

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
    items: LineItem[],
    taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
    calculationContext: TaxCalculationContext
  ): Promise<number>
}

export function isTaxCalculationStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is ITaxCalculationStrategy {
  return typeof object.calculate === "function"
}
