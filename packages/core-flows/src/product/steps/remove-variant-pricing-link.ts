import { Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  variant_ids: string[]
}

export const removeVariantPricingLinkStepId = "remove-variant-pricing-link"
export const removeVariantPricingLinkStep = createStep(
  removeVariantPricingLinkStepId,
  async (data: StepInput, { container }) => {
    if (!data.variant_ids.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.delete({
      [Modules.PRODUCT]: { variant_id: data.variant_ids },
    })
    return new StepResponse(void 0, data.variant_ids)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    await remoteLink.restore({
      [Modules.PRODUCT]: { variant_id: prevData },
    })
  }
)
