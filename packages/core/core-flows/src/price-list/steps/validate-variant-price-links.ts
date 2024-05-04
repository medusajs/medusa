import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const validateVariantPriceLinksStepId = "validate-variant-price-links"
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

    const variantPricingLinkQuery = remoteQueryObjectFromString({
      entryPoint: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: { variant_id: variantIds, take: null },
    })

    const links = await remoteQuery(variantPricingLinkQuery)
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
