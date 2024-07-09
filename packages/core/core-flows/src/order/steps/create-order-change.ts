import { CreateOrderChangeDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createOrderChangeStepId = "create-order-change"
export const createOrderChangeStep = createStep(
  createOrderChangeStepId,
  async (data: CreateOrderChangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.createOrderChange(data)

    return new StepResponse(created, created.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteOrderChanges(id)
  }
)
