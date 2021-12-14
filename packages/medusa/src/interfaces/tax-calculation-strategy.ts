import { LineItem } from "../models/line-item"
// import { TaxLine } from "../models/tax-line"
import { TaxCalculationContext } from "./tax-service"

export interface ITaxCalculationStrategy {
  calculate(
    items: LineItem[],
    taxLines: object[], // TaxLine[]
    calculationContext: TaxCalculationContext
  ): Promise<number>
}

export function isTaxCalculationStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is ITaxCalculationStrategy {
  return typeof object.calculate === "function"
}
