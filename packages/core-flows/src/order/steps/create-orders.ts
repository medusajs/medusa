import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateOrdersStepInput = CreateOrderDTO[]

export const createOrdersStepId = "create-orders"
export const createOrdersStep = createStep(
  createOrdersStepId,
  async (data: CreateOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.create(data)
    return new StepResponse(
      created,
      created.map((store) => store.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.delete(createdIds)
  }
)
