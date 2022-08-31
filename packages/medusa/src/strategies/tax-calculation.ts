import {
  LineItem,
  LineItemTaxLine,
  ShippingMethod,
  ShippingMethodTaxLine,
} from "../models"
import { ITaxCalculationStrategy, TaxCalculationContext } from "../interfaces"
import { calculatePriceTaxAmount } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

class TaxCalculationStrategy implements ITaxCalculationStrategy {
  protected readonly featureFlagRouter_: FlagRouter

  constructor({ featureFlagRouter }) {
    this.featureFlagRouter_ = featureFlagRouter
  }

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

    for (const item of items) {
      const allocations = context.allocation_map[item.id] || {}

      const filteredTaxLines = taxLines.filter((tl) => tl.item_id === item.id)

      const totalTaxRate = filteredTaxLines.reduce(
        (accRate: number, nextLineItemTaxLine: LineItemTaxLine) => {
          return accRate + (nextLineItemTaxLine.rate || 0) / 100
        },
        0
      )
      const taxIncludedInPrice = !item.includes_tax
        ? 0
        : Math.round(
            calculatePriceTaxAmount({
              price: item.unit_price,
              taxRate: totalTaxRate,
              includesTax: item.includes_tax,
            })
          )
      let taxableAmount = (item.unit_price - taxIncludedInPrice) * item.quantity
      taxableAmount -=
        ((allocations.discount && allocations.discount.unit_amount) || 0) *
        item.quantity

      for (const filteredTaxLine of filteredTaxLines) {
        taxTotal += Math.round(
          calculatePriceTaxAmount({
            price: taxableAmount,
            taxRate: filteredTaxLine.rate / 100,
          })
        )
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
