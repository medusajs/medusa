import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreatePriceSetDTO, IPricingModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const createPriceSetsStepId = "create-price-sets"
export const createPriceSetsStep = createStep(
  createPriceSetsStepId,
  async (data: CreatePriceSetDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const priceSets = await pricingModule.createPriceSets(data)

    return new StepResponse(
      priceSets,
      priceSets.map((priceSet) => priceSet.id)
    )
  },
  async (priceSets, { container }) => {
    if (!priceSets?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.deletePriceSets(priceSets)
  }
)
