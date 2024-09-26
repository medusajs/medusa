import {
  CancelOrderReturnDTO,
  IOrderModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const cancelOrderReturnStepId = "cancel-order-return"
/**
 * This step cancels a return.
 */
export const cancelOrderReturnStep = createStep(
  cancelOrderReturnStepId,
  async (data: CancelOrderReturnDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.cancelReturn(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.revertLastVersion(orderId)
  }
)
