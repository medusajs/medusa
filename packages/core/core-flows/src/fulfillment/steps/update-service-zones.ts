import { FulfillmentWorkflow, IFulfillmentModuleService } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = FulfillmentWorkflow.UpdateServiceZonesWorkflowInput

export const updateServiceZonesStepId = "update-service-zones"
export const updateServiceZonesStep = createStep(
  updateServiceZonesStepId,
  async (input: StepInput, { container }) => {
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
