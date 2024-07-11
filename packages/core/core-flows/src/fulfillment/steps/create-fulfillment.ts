import { FulfillmentTypes, IFulfillmentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
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
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.cancelFulfillment(id)
  }
)
