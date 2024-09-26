import { IFulfillmentModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const deleteFulfillmentSetsStepId = "delete-fulfillment-sets"
/**
 * This step deletes one or more fulfillment sets.
 */
export const deleteFulfillmentSetsStep = createStep(
  deleteFulfillmentSetsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.softDeleteFulfillmentSets(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.restoreFulfillmentSets(prevIds)
  }
)
