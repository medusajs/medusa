import { FulfillmentWorkflow, IFulfillmentModuleService } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateServiceZonesStepId = "update-service-zones"
/**
 * This step updates service zones matching the specified filters.
 */
export const updateServiceZonesStep = createStep(
  updateServiceZonesStepId,
  async (input: FulfillmentWorkflow.UpdateServiceZonesWorkflowInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
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
      ModuleRegistrationName.FULFILLMENT
    )

    await service.upsertServiceZones(prevData)
  }
)
