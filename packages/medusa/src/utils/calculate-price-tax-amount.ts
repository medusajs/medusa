import { featureFlagRouter } from "../loaders/feature-flags"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

/**
 * Return the tax amount that
 * - is includes in the price if it is tax inclusive
 * - will be applied on to the price if it is tax exclusive
 * @param price
 * @param includesTax
 * @param taxRate
 */
export function calculatePriceTaxAmount({
  price,
  includesTax,
  taxRate,
}: {
  price: number
  includesTax?: boolean
  taxRate: number
}): number {
  if (
    featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key) &&
    includesTax
  ) {
    return (taxRate * price) / (1 + taxRate)
  }

  return price * taxRate
}
