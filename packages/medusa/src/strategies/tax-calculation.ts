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
      const includesTax =
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) && item.includes_tax

      let taxableAmount
      if (includesTax) {
        const taxRate = filteredTaxLines.reduce(
          (accRate: number, nextLineItemTaxLine: LineItemTaxLine) => {
            return accRate + (nextLineItemTaxLine.rate || 0) / 100
          },
          0
        )
        const taxIncludedInPrice = Math.round(
          calculatePriceTaxAmount({
            price: item.unit_price,
            taxRate,
            includesTax,
          })
        )
        taxableAmount = (item.unit_price - taxIncludedInPrice) * item.quantity
      } else {
        taxableAmount = item.unit_price * item.quantity
      }

      taxableAmount -= allocations.discount?.amount ?? 0

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
    const taxInclusiveEnabled = this.featureFlagRouter_.isFeatureEnabled(
      TaxInclusivePricingFeatureFlag.key
    )

    let taxTotal = 0
    for (const sm of shipping_methods) {
      const lineRates = taxLines.filter((tl) => tl.shipping_method_id === sm.id)
      for (const lineRate of lineRates) {
        taxTotal += calculatePriceTaxAmount({
          price: sm.price,
          taxRate: lineRate.rate / 100,
          includesTax: taxInclusiveEnabled && sm.includes_tax,
        })
      }
    }
    return taxTotal
  }
}

export default TaxCalculationStrategy
