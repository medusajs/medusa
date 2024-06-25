import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService, ReceiveOrderReturnDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type ReceiveReturnStepInput = ReceiveOrderReturnDTO

export const receiveReturnStepId = "receive-return"
export const receiveReturnStep = createStep(
  receiveReturnStepId,
  async (data: ReceiveReturnStepInput, { container }) => {
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
