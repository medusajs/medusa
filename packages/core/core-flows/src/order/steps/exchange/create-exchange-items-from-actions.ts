import {
  CreateOrderExchangeItemDTO,
  IOrderModuleService,
  OrderChangeActionDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of creating exchange items from change actions.
 */
export type CreateOrderExchangeItemsFromActionsInput = {
  /**
   * The change actions to create exchange items from.
   */
  changes: OrderChangeActionDTO[]
  /**
   * The ID of the exchange to create the items for.
   */
  exchangeId: string
}

/**
 * This step creates exchange items from change actions.
 * 
 * :::note
 * 
 * You can retrieve an order change action details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = createOrderExchangeItemsFromActionsStep({
 *   exchangeId: "exchange_123",
 *   changes: [
 *     {
 *       id: "orchact_123",
 *       // other order change action details...
 *     }
 *   ]
 * })
 */
export const createOrderExchangeItemsFromActionsStep = createStep(
  "create-exchange-items-from-change-actions",
  async (input: CreateOrderExchangeItemsFromActionsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
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
      Modules.ORDER
    )

    await orderModuleService.deleteOrderExchangeItems(ids)
  }
)
