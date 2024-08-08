import { IOrderModuleService, ReceiveOrderReturnDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const receiveReturnStepId = "receive-return"
/**
 * This step marks a return as received.
 */
export const receiveReturnStep = createStep(
  receiveReturnStepId,
  async (data: ReceiveOrderReturnDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    if (!data.items?.length) {
      return new StepResponse(void 0)
    }

    const received = await service.receiveReturn(data)
    return new StepResponse(received, data.return_id)
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
