import { LineItem } from "../models/line-item"
import { ShippingMethod } from "../models/shipping-method"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { TaxCalculationContext } from "../interfaces/tax-service"
import { ITaxCalculationStrategy } from "../interfaces/tax-calculation-strategy"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { FlagRouter } from "../utils/flag-router"

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

      let taxableAmount
      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) &&
        item.includes_tax
      ) {
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
            includesTax: item.includes_tax,
          })
        )
        taxableAmount = (item.unit_price - taxIncludedInPrice) * item.quantity
      } else {
        taxableAmount = item.unit_price * item.quantity
      }

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
        const rate = lineRate.rate / 100
        if (
          this.featureFlagRouter_.isFeatureEnabled(
            TaxInclusivePricingFeatureFlag.key
          ) &&
          sm.includes_tax
        ) {
          taxTotal += Math.round((amount * rate) / (1 + rate))
        } else {
          taxTotal += Math.round(amount * rate)
        }
      }
    }
    return taxTotal
  }
}

export default TaxCalculationStrategy
