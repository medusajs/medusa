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

    const updated = await service.updateFulfillment(id, data)

    return new StepResponse(updated, fulfillment)
  },
  async (fulfillment, { container }) => {
    if (!fulfillment) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )
    const { id, ...data } = fulfillment

    // TODO: this does not revert the relationships that are created in invoke step
    // There should be a consistent way to handle across workflows
    await service.updateFulfillment(id, data)
  }
)
