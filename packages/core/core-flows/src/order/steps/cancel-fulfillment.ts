import { CancelOrderFulfillmentDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const cancelOrderFulfillmentStepId = "cancel-order-fulfillment"
/**
 * This step cancels an order's fulfillment.
 */
export const cancelOrderFulfillmentStep = createStep(
  cancelOrderFulfillmentStepId,
  async (data: CancelOrderFulfillmentDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.cancelFulfillment(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.revertLastVersion(orderId)
  }
)
