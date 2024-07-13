import { CreateOrderExchangeDTO, IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateOrderExchangesStepInput = CreateOrderExchangeDTO[]

export const createOrderExchangesStepId = "create-order-exchanges"
export const createOrderExchangesStep = createStep(
  createOrderExchangesStepId,
  async (data: CreateOrderExchangesStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const orderExchanges = await service.createOrderExchanges(data)

    const exchangeIds = orderExchanges.map((exchange) => exchange.id)

    return new StepResponse(orderExchanges, exchangeIds)
  },
  async (exchangeIds, { container }) => {
    if (!exchangeIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteOrderExchanges(exchangeIds)
  }
)
