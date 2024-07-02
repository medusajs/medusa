import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CancelOrderExchangeDTO, IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CancelOrderExchangeStepInput = CancelOrderExchangeDTO

export const cancelOrderExchangeStepId = "cancel-order-swap"
export const cancelOrderExchangeStep = createStep(
  cancelOrderExchangeStepId,
  async (data: CancelOrderExchangeStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.cancelExchange(data)
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
