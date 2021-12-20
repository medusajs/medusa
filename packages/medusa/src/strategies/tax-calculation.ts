import { LineItem } from "../models/line-item"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { TaxCalculationContext } from "../interfaces/tax-service"
import { ITaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"

class TaxCalculationStrategy implements ITaxCalculationStrategy {
  async calculate(
    items: LineItem[],
    taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[],
    calculationContext: TaxCalculationContext
  ): Promise<number> {
    let result = 0

    for (const i of items) {
      const allocations = calculationContext.allocation_map[i.id] || {}

      let taxableAmount = i.quantity * i.unit_price

      // TODO: Temporary until further implementation of taxes
      let region = calculationContext.region as any // eslint-disable-line
      if (region.gift_cards_taxable) {
        taxableAmount -=
          (allocations.gift_card && allocations.gift_card.amount) || 0
      }

      taxableAmount -=
        (allocations.discount && allocations.discount.amount) || 0

      const lineRates = taxLines.filter(
        (tl) => "item_id" in tl && tl.item_id === i.id
      )
      for (const lineRate of lineRates) {
        result += taxableAmount * (lineRate.rate / 100)
      }
    }

    for (const sm of calculationContext.shipping_methods) {
      const amount = sm.price
      const lineRates = taxLines.filter(
        (tl) => "shipping_method_id" in tl && tl.shipping_method_id === sm.id
      )
      for (const lineRate of lineRates) {
        result += amount * (lineRate.rate / 100)
      }
    }

    return Math.round(result)
  }
}

export default TaxCalculationStrategy
