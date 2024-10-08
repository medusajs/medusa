import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CreateVariantPricingLinkStepInput = {
  links: {
    variant_id: string
    price_set_id: string
  }[]
}

export const createVariantPricingLinkStepId = "create-variant-pricing-link"
/**
 * This step creates links between variant and price set records.
 */
export const createVariantPricingLinkStep = createStep(
  createVariantPricingLinkStepId,
  async (data: CreateVariantPricingLinkStepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.create(
      data.links.map((entry) => ({
        [Modules.PRODUCT]: {
          variant_id: entry.variant_id,
        },
        [Modules.PRICING]: {
          price_set_id: entry.price_set_id,
        },
      }))
    )

    return new StepResponse(void 0, data)
  },
  async (data, { container }) => {
    if (!data?.links?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const links = data.links.map((entry) => ({
      [Modules.PRODUCT]: {
        variant_id: entry.variant_id,
      },
      [Modules.PRICING]: {
        price_set_id: entry.price_set_id,
      },
    }))

    await remoteLink.dismiss(links)
  }
)
