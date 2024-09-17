import { IPricingModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deletePriceListsStepId = "delete-price-lists"
/**
 * This step deletes one or more price lists.
 */
export const deletePriceListsStep = createStep(
  deletePriceListsStepId,
  async (ids: string[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.softDeletePriceLists(ids)

    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.restorePriceLists(idsToRestore)
  }
)
