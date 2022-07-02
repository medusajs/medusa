import { LineItem } from "../models/line-item"
import { ShippingMethod } from "../models/shipping-method"
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
    const lineItemsTaxLines = taxLines.filter(
      (tl) => "item_id" in tl
    ) as LineItemTaxLine[]
    const shippingMethodsTaxLines = taxLines.filter(
      (tl) => "shipping_method_id" in tl
    ) as ShippingMethodTaxLine[]

    return Math.round(
      this.calculateLineItemsTax(items, lineItemsTaxLines, calculationContext) +
        this.calculateShippingMethodsTax(
          calculationContext.shipping_methods,
          shippingMethodsTaxLines
        )
    )
  }

  private calculateLineItemsTax(
    items: LineItem[],
    taxLines: LineItemTaxLine[],
    context: TaxCalculationContext
  ): number {
    let taxTotal = 0
    for (const i of items) {
      const allocations = context.allocation_map[i.id] || {}

      let taxableAmount = i.quantity * i.unit_price

      if (context.region.gift_cards_taxable) {
        taxableAmount -=
          (allocations.gift_card && allocations.gift_card.amount) || 0
      }

      taxableAmount -=
        ((allocations.discount && allocations.discount.unit_amount) || 0) *
        i.quantity

      const lineRates = taxLines.filter((tl) => tl.item_id === i.id)
      for (const lineRate of lineRates) {
        taxTotal += Math.round(taxableAmount * (lineRate.rate / 100))
      }
    }
    return taxTotal
  }

  private calculateShippingMethodsTax(
    shipping_methods: ShippingMethod[],
    taxLines: ShippingMethodTaxLine[]
  ): number {
    let taxTotal = 0
    for (const sm of shipping_methods) {
      const amount = sm.price
      const lineRates = taxLines.filter((tl) => tl.shipping_method_id === sm.id)
      for (const lineRate of lineRates) {
        taxTotal += Math.round(amount * (lineRate.rate / 100))
      }
    }
    return taxTotal
  }
}

export default TaxCalculationStrategy
