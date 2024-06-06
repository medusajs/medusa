import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CancelOrderFulfillmentDTO, IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CancelOrderFulfillmentStepInput = CancelOrderFulfillmentDTO

export const cancelOrderFulfillmentStepId = "cancel-order-fulfillment"
export const cancelOrderFulfillmentStep = createStep(
  cancelOrderFulfillmentStepId,
  async (data: CancelOrderFulfillmentStepInput, { container }) => {
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
