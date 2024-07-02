import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CancelOrderReturnDTO, IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CancelOrderReturnStepInput = CancelOrderReturnDTO

export const cancelOrderReturnStepId = "cancel-order-return"
export const cancelOrderReturnStep = createStep(
  cancelOrderReturnStepId,
  async (data: CancelOrderReturnStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.cancelReturn(data)
    return new StepResponse(void 0, data.return_id)
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
