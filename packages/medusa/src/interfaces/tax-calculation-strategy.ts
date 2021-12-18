import { LineItem } from "../models/line-item"
import { TaxCalculationContext } from "./tax-service"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"

export interface ITaxCalculationStrategy {
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
