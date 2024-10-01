import {
  FulfillmentTypes,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createReturnFulfillmentStepId = "create-return-fulfillment"
/**
 * This step creates a fulfillment for a return.
 */
export const createReturnFulfillmentStep = createStep(
  createReturnFulfillmentStepId,
  async (data: FulfillmentTypes.CreateFulfillmentDTO, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const fulfillment = await service.createReturnFulfillment(data)

    return new StepResponse(fulfillment, fulfillment.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    // await service.cancelReturnFulfillment(id) // TODO: Implement cancelReturnFulfillment
    await service.cancelFulfillment(id)
  }
)
