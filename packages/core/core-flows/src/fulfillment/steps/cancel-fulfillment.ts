import { IFulfillmentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const cancelFulfillmentStepId = "cancel-fulfillment"
/**
 * This step cancels a fulfillment.
 */
export const cancelFulfillmentStep = createStep(
  cancelFulfillmentStepId,
  async (id: string, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.cancelFulfillment(id)

    return new StepResponse(void 0, id)
  }
)
