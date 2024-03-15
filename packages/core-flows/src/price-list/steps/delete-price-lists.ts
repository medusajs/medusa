import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deletePriceListsStepId = "delete-campaigns"
export const deletePriceListsStep = createStep(
  deletePriceListsStepId,
  async (ids: string[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    // TODO: Implement soft delete price lists
    await pricingModule.deletePriceLists(ids)

    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    // TODO: Implement restore price lists
    // await pricingModule.restorePriceLists(idsToRestore)
  }
)
