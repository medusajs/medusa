import { Modules } from "@medusajs/modules-sdk"
import { ILinkModule } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  variant_ids: string[]
}

export const removeVariantPricingLinkStepId = "remove-variant-pricing-link"
export const removeVariantPricingLinkStep = createStep(
  removeVariantPricingLinkStepId,
  async (data: StepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const linkModule: ILinkModule = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "variant_id",
      Modules.PRICING,
      "price_set_id"
    )

    const links = (await linkModule.list(
      {
        variant_id: data.variant_ids,
      },
      { select: ["id", "variant_id", "price_set_id"] }
    )) as { id: string; variant_id: string; price_set_id: string }[]

    await remoteLink.delete(links.map((link) => link.id))
    return new StepResponse(void 0, links)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.create(
      prevData.map((entry) => ({
        [Modules.PRODUCT]: {
          variant_id: entry.variant_id,
        },
        [Modules.PRICING]: {
          price_set_id: entry.price_set_id,
        },
      }))
    )
  }
)
