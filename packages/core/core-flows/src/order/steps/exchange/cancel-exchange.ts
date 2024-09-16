import { CancelOrderExchangeDTO, IOrderModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const cancelOrderExchangeStepId = "cancel-order-swap"
/**
 * This step cancels an exchange.
 */
export const cancelOrderExchangeStep = createStep(
  cancelOrderExchangeStepId,
  async (data: CancelOrderExchangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.cancelExchange(data)
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
