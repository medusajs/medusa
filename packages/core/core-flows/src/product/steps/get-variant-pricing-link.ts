import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  ids: string[]
}

export const getVariantPricingLinkStepId = "get-variant-pricing-link"
export const getVariantPricingLinkStep = createStep(
  getVariantPricingLinkStepId,
  async (data: StepInput, { container }) => {
    if (!data.ids.length) {
      return new StepResponse([])
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkService = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "variant_id",
      Modules.PRICING,
      "price_set_id"
    )!

    const existingItems = (await linkService.list(
      { variant_id: data.ids },
      { select: ["variant_id", "price_set_id"] }
    )) as {
      variant_id: string
      price_set_id: string
    }[]

    if (existingItems.length !== data.ids.length) {
      const missing = arrayDifference(
        data.ids,
        existingItems.map((i) => i.variant_id)
      )

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Variants with IDs ${missing.join(", ")} do not have prices associated.`
      )
    }

    return new StepResponse(existingItems)
  }
)
