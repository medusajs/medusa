import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The links to create between variant and price set records.
 */
export type CreateVariantPricingLinkStepInput = {
  /**
   * The variant and price set record IDs to link.
   */
  links: {
    /**
     * The variant's ID.
     */
    variant_id: string
    /**
     * The price set's ID.
     */
    price_set_id: string
  }[]
}

export const createVariantPricingLinkStepId = "create-variant-pricing-link"
/**
 * This step creates links between variant and price set records.
 * 
 * @example
 * const data = createVariantPricingLinkStep({
 *   links: [
 *     {
 *       variant_id: "variant_123",
 *       price_set_id: "pset_123"
 *     }
 *   ]
 * })
 */
export const createVariantPricingLinkStep = createStep(
  createVariantPricingLinkStepId,
  async (data: CreateVariantPricingLinkStepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
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

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
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
