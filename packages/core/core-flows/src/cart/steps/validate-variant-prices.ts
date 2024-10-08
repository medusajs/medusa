import { BigNumberInput } from "@medusajs/framework/types"
import { MedusaError, isPresent } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

export interface ValidateVariantPricesStepInput {
  variants: {
    id: string
    calculated_price?: {
      calculated_amount?: BigNumberInput | null
    }
  }[]
}

export const validateVariantPricesStepId = "validate-variant-prices"
/**
 * This step validates the specified variant objects to ensure they have prices.
 */
export const validateVariantPricesStep = createStep(
  validateVariantPricesStepId,
  async (data: ValidateVariantPricesStepInput, { container }) => {
    const priceNotFound: string[] = []
    for (const variant of data.variants) {
      if (!isPresent(variant?.calculated_price?.calculated_amount)) {
        priceNotFound.push(variant.id)
      }
    }

    if (priceNotFound.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variants with IDs ${priceNotFound.join(", ")} do not have a price`
      )
    }
  }
)
