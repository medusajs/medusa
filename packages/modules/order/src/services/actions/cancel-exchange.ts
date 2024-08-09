import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import { ChangeActionType, promiseAll } from "@medusajs/utils"

async function createOrderChange(
  service,
  data,
  exchangeOrder,
  actions,
  sharedContext
) {
  return await service.createOrderChange_(
    {
      order_id: exchangeOrder.order_id,
      exchange_id: exchangeOrder.id,
      reference: "exchange",
      reference_id: exchangeOrder.id,
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
  const exchangeOrder = await this.retrieveOrderExchange(
    data.exchange_id,
    {
      select: [
        "id",
        "order_id",
        "additional_items.id",
        "additional_items.item_id",
        "additional_items.quantity",
      ],
      relations: ["additional_items", "shipping_methods"],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  exchangeOrder.additional_items.forEach((item) => {
    actions.push({
      action: ChangeActionType.ITEM_REMOVE,
      order_id: exchangeOrder.order_id,
      exchange_id: exchangeOrder.id,
      reference: "exchange",
      reference_id: exchangeOrder.id,
      details: {
        order_id: exchangeOrder.order_id,
        reference_id: item.item_id,
        exchange_id: exchangeOrder.id,
        quantity: item.quantity,
      },
    })
  })

  exchangeOrder.shipping_methods?.forEach((shipping) => {
    actions.push({
      action: ChangeActionType.SHIPPING_REMOVE,
      order_id: exchangeOrder.order_id,
      exchange_id: exchangeOrder.id,
      reference: "exchange",
      reference_id: shipping.id,
      amount: shipping.price,
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
    this.updateOrderExchanges(
      [
        {
          data: {
            canceled_at: new Date(),
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
