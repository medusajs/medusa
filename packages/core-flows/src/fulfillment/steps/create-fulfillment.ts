import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { FulfillmentTypes, IFulfillmentModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createFulfillmentStepId = "create-fulfillment"
export const createFulfillmentStep = createStep(
  createFulfillmentStepId,
  async (data: FulfillmentTypes.CreateFulfillmentDTO, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const fulfillment = await service.createFulfillment(data)

    return new StepResponse(fulfillment, fulfillment.id)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.delete(ids)
  }
)
