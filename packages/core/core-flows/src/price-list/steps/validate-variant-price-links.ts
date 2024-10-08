import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const validateVariantPriceLinksStepId = "validate-variant-price-links"
/**
 * This step validates that the specified variants have prices.
 */
export const validateVariantPriceLinksStep = createStep(
  validateVariantPriceLinksStepId,
  async (
    data: {
      prices?: {
        variant_id: string
      }[]
    }[],
    { container }
  ) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

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
