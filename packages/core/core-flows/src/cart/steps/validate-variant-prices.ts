import type { BigNumberInput } from "@zjedene-medusa/framework/types"
import { MedusaError, isPresent } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the variants to validate.
 */
export interface ValidateVariantPricesStepInput {
  /**
   * The variants to validate.
   */
  variants: {
    /**
     * The ID of the variant.
     */
    id: string
    /**
     * The calculated price of the variant.
     */
    calculated_price?: {
      /**
       * The calculated amount of the price.
       */
      calculated_amount?: BigNumberInput | null
    }
  }[]
}

export const validateVariantPricesStepId = "validate-variant-prices"
/**
 * This step validates the specified variant objects to ensure they have prices.
 * If not valid, the step throws an error.
 *
 * @example
 * const data = validateVariantPricesStep({
 *   variants: [
 *     {
 *       id: "variant_123",
 *     },
 *     {
 *       id: "variant_321",
 *       calculated_price: {
 *         calculated_amount: 10,
 *       }
 *     }
 *   ]
 * })
 */
export const validateVariantPricesStep = createStep(
  validateVariantPricesStepId,
  async (data: ValidateVariantPricesStepInput, { container }) => {
    if (!data.variants?.length) {
      return
    }

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
