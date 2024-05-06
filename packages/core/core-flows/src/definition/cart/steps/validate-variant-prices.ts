import { BigNumberInput } from "@medusajs/types"
import { MedusaError, isDefined } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variants: {
    id: string
    calculated_price?: BigNumberInput
  }[]
}

export const validateVariantPricesStepId = "validate-variant-prices"
export const validateVariantPricesStep = createStep(
  validateVariantPricesStepId,
  async (data: StepInput, { container }) => {
    const priceNotFound: string[] = []

    for (const variant of data.variants) {
      if (!isDefined(variant.calculated_price)) {
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
