import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateOrderReturnDTO, IOrderModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type CreateReturnStepInput = CreateOrderReturnDTO

export const createReturnStepId = "create-return"
export const createReturnStep = createStep(
  createReturnStepId,
  async (data: CreateReturnStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.createReturn(data)
    return new StepResponse(created, created)
  },
  async (createdId, { container }) => {
    if (!createdId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    // TODO: delete return
  }
)
