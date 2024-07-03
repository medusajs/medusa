import { CreateOrderReturnDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateReturnStepInput = CreateOrderReturnDTO

export const createReturnStepId = "create-return"
export const createReturnStep = createStep(
  createReturnStepId,
  async (data: CreateReturnStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const orderReturn = await service.createReturn(data)
    return new StepResponse(orderReturn, data.order_id)
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
