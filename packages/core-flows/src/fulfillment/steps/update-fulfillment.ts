import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { FulfillmentWorkflow, IFulfillmentModuleService } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateFulfillmentStepId = "update-fulfillment"
export const updateFulfillmentStep = createStep(
  updateFulfillmentStepId,
  async (
    input: FulfillmentWorkflow.UpdateFulfillmentWorkflowInput,
    { container }
  ) => {
    const { id, ...data } = input
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([data])
    const fulfillment = await service.retrieveFulfillment(id, {
      select: selects,
      relations,
    })

    await service.updateFulfillment(id, data)

    return new StepResponse(void 0, fulfillment)
  },
  async (fulfillment, { container }) => {
    if (!fulfillment) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )
    const { id, ...data } = fulfillment

    await service.updateFulfillment(id, data)
  }
)
