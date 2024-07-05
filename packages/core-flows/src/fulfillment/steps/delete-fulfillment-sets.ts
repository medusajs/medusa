import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteFulfillmentSetsStepId = "delete-fulfillment-sets"
export const deleteFulfillmentSetsStep = createStep(
  deleteFulfillmentSetsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.softDelete(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.restore(prevIds)
  }
)
