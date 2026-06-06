import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to validate that the specified variants have prices.
 */
export type ValidateVariantPriceLinksStepInput = {
  /**
   * The prices to validate that their specified variants have prices.
   */
  prices?: {
    /**
     * The variant ID.
     */
    variant_id: string
  }[]
}[]

export const validateVariantPriceLinksStepId = "validate-variant-price-links"
/**
 * This step validates that the specified variants have prices.
 * If not valid, the step throws an error.
 *
 * @example
 * const data = validateVariantPriceLinksStep([
 *   {
 *     prices: [
 *       {
 *         variant_id: "variant_123",
 *       }
 *     ]
 *   }
 * ])
 */
export const validateVariantPriceLinksStep = createStep(
  validateVariantPriceLinksStepId,
  async (data: ValidateVariantPriceLinksStepInput, { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    if (!data.length) {
      return new StepResponse(void 0)
    }

    const variantIds: string[] = data
      .map((pl) => pl?.prices?.map((price) => price.variant_id) || [])
      .filter(Boolean)
      .flat(1)

    const links = await remoteQuery({
      entryPoint: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: { variant_id: variantIds },
    })
    const variantPriceSetMap: Record<string, string> = {}

    for (const link of links) {
      variantPriceSetMap[link.variant_id] = link.price_set_id
    }

    const withoutLinks = variantIds.filter((id) => !variantPriceSetMap[id])

    if (withoutLinks.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No price set exist for variants: ${withoutLinks.join(", ")}`
      )
    }

    return new StepResponse(variantPriceSetMap)
  }
)
