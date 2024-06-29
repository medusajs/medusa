import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { ChangeActionType } from "../../utils"

async function createOrderChange(
  service,
  data,
  returnRef,
  actions,
  sharedContext
) {
  return await service.createOrderChange_(
    {
      order_id: data.order_id,
      exchange_id: returnRef.id,
      reference: "return",
      reference_id: returnRef.id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions,
    },
    sharedContext
  )
}

export async function cancelExchange(
  this: any,
  data: OrderTypes.CancelOrderExchangeDTO,
  sharedContext?: Context
) {
  const exchangeOrder = await this.orderService_.retrieveExchange(
    data.exchange_id,
    {
      select: [
        "id",
        "return.id",
        "return.items.id",
        "return.items.quantity",
        "additional_items.id",
        "additional_items.quantity",
      ],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  exchangeOrder.return.items.forEach((item) => {
    actions.push({
      action: ChangeActionType.CANCEL_RETURN_ITEM,
      exchange_id: exchangeOrder.id,
      return_id: exchangeOrder.return.id,
      reference: "return",
      reference_id: exchangeOrder.return.id,
      details: {
        reference_id: item.id,
        exchange_id: exchangeOrder.id,
        return_id: exchangeOrder.return.id,
        quantity: item.quantity,
      },
    })
  })

  exchangeOrder.additional_items.forEach((item) => {
    actions.push({
      action: ChangeActionType.ITEM_REMOVE,
      exchange_id: exchangeOrder.id,
      reference: "exchange",
      reference_id: exchangeOrder.id,
      details: {
        reference_id: item.id,
        exchange_id: exchangeOrder.id,
        quantity: item.quantity,
      },
    })
  })

  const [change] = await createOrderChange(
    this,
    data,
    exchangeOrder,
    actions,
    sharedContext
  )

  await promiseAll([
    this.updateExchanges(
      [
        {
          data: {
            canceled_at: Date.now(),
          },
          selector: {
            id: exchangeOrder.id,
          },
        },
      ],
      sharedContext
    ),
    this.confirmOrderChange(change.id, sharedContext),
  ])

  return exchangeOrder
}
