import { CreateOrderReturnDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateReturnsStepInput = CreateOrderReturnDTO[]

export const createReturnsStepId = "create-returns"
export const createReturnsStep = createStep(
  createReturnsStepId,
  async (data: CreateReturnsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    console.log(service["createReturns"])
    // @ts-expect-error
    const orderReturns = await service.createReturns(data)

    const returnIds = orderReturns.map((ret) => ret.id)

    console.log(orderReturns)
    return new StepResponse(orderReturns, returnIds)
  },
  async (returnIds, { container }) => {
    if (!returnIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    // @ts-expect-error
    await service.deleteReturns(returnIds)
  }
)
