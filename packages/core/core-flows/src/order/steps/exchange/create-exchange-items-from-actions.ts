import {
  CreateOrderExchangeItemDTO,
  IOrderModuleService,
  OrderChangeActionDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateOrderExchangeItemsFromActionsInput = {
  changes: OrderChangeActionDTO[]
  exchangeId: string
}

export const createOrderExchangeItemsFromActionsStep = createStep(
  "create-exchange-items-from-change-actions",
  async (input: CreateOrderExchangeItemsFromActionsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const exchangeItems = input.changes.map((item) => {
      return {
        exchange_id: input.exchangeId,
        item_id: item.details?.reference_id! as string,
        quantity: item.details?.quantity as number,
        note: item.internal_note,
        metadata: (item.details?.metadata as Record<string, unknown>) ?? {},
      }
    }) as CreateOrderExchangeItemDTO[]

    const createdExchangeItems =
      await orderModuleService.createOrderExchangeItems(exchangeItems)

    return new StepResponse(
      createdExchangeItems,
      createdExchangeItems.map((i) => i.id)
    )
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await orderModuleService.deleteOrderExchangeItems(ids)
  }
)
