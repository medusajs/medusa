import { LineItem } from "../models/line-item"
// import { TaxLine } from "../models/tax-line"
import { TaxCalculationContext } from "./tax-service"

export interface ITaxCalculationStrategy {
  kind_: "TAX_CALCULATION_STRATEGY"
  calculate(
    items: LineItem[],
    taxLines: object[],
    calculationContext: TaxCalculationContext
  ): Promise<number>
}

export function isTaxCalculationStrategy(
  object: any
): object is ITaxCalculationStrategy {
  return object.kind_ === "TAX_CALCULATION_STRATEGY"
}
