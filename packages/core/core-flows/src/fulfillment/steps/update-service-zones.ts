import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateServiceZonesStepId = "update-service-zones"
/**
 * This step updates service zones matching the specified filters.
 */
export const updateServiceZonesStep = createStep(
  updateServiceZonesStepId,
  async (
    input: FulfillmentWorkflow.UpdateServiceZonesWorkflowInput,
    { container }
  ) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])

    const prevData = await service.listServiceZones(input.selector, {
      select: selects,
      relations,
    })

    const updatedServiceZones = await service.updateServiceZones(
      input.selector,
      input.update
    )

    return new StepResponse(updatedServiceZones, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.upsertServiceZones(prevData)
  }
)
