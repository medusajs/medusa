import { LineItem } from "../models/line-item"
import { TaxLine } from "../models/tax-line"
import { TaxCalculationContext } from "../interfaces/tax-service"
import { ITaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"

class TaxCalculationStrategy implements ITaxCalculationStrategy {
  async calculate(
    items: LineItem[],
    taxLines: TaxLine[],
    calculationContext: TaxCalculationContext
  ): Promise<number> {
    let result = 0

    for (const i of items) {
      const allocations = calculationContext.allocation_map[i.id] || {}

      let taxableAmount = i.quantity * i.unit_price

      if (calculationContext.region.giftcards_taxable) {
        taxableAmount -=
          (allocations.gift_card && allocations.gift_card.amount) || 0
      }

      taxableAmount -=
        (allocations.discount && allocations.discount.amount) || 0

      const lineRates = taxLines.filter((tl) => tl.item_id === i.id)
      for (const lineRate of lineRates) {
        result += taxableAmount * lineRate.rate
      }
    }

    return Math.round(result)
  }
}

export default TaxCalculationStrategy
