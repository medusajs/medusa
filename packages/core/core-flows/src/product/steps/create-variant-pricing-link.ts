import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  links: {
    variant_id: string
    price_set_id: string
  }[]
}

export const createVariantPricingLinkStepId = "create-variant-pricing-link"
export const createVariantPricingLinkStep = createStep(
  createVariantPricingLinkStepId,
  async (data: StepInput, { container }) => {
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
