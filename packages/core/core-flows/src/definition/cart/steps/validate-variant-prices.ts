import { BigNumberInput } from "@medusajs/types"
import { MedusaError, isPresent } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variants: {
    id: string
    calculated_price?: {
      calculated_amount?: BigNumberInput | null
    }
  }[]
}

export const validateVariantPricesStepId = "validate-variant-prices"
export const validateVariantPricesStep = createStep(
  validateVariantPricesStepId,
  async (data: StepInput, { container }) => {
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
