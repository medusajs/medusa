import { featureFlagRouter } from "../loaders/feature-flags";
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing";

export function calculatePriceTaxAmount({
  price,
  includesTax,
  taxRate
}: {
  price: number
  includesTax?: boolean
  taxRate: number
}): number {
  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key) && includesTax) {
    return (taxRate * price) / (1 + taxRate)
  }

  return price * taxRate
}

