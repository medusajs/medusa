import { IPricingModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deletePricePreferencesStepId = "delete-price-preferences"
export const deletePricePreferencesStep = createStep(
  deletePricePreferencesStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await service.softDeletePricePreferences(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await service.restorePricePreferences(prevIds)
  }
)
