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
      order_id: returnRef.order_id,
      return_id: returnRef.id,
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

export async function cancelReturn(
  this: any,
  data: OrderTypes.CancelOrderReturnDTO,
  sharedContext?: Context
) {
  const returnOrder = await this.retrieveReturn(
    data.return_id,
    {
      select: [
        "id",
        "order_id",
        "items.item_id",
        "items.quantity",
        "items.received_quantity",
      ],
      relations: ["items", "shipping_methods"],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  returnOrder.items.forEach((item) => {
    actions.push({
      action: ChangeActionType.CANCEL_RETURN_ITEM,
      order_id: returnOrder.order_id,
      return_id: returnOrder.id,
      reference: "return",
      reference_id: returnOrder.id,
      details: {
        reference_id: item.item_id,
        order_id: returnOrder.order_id,
        return_id: returnOrder.id,
        quantity: item.quantity,
      },
    })
  })

  returnOrder.shipping_methods?.forEach((shipping) => {
    actions.push({
      action: ChangeActionType.SHIPPING_REMOVE,
      order_id: returnOrder.order_id,
      return_id: returnOrder.id,
      reference: "return",
      reference_id: shipping.id,
      amount: shipping.price,
    })
  })

  const [change] = await createOrderChange(
    this,
    data,
    returnOrder,
    actions,
    sharedContext
  )

  await promiseAll([
    this.updateReturns(
      [
        {
          data: {
            canceled_at: new Date(),
          },
          selector: {
            id: returnOrder.id,
          },
        },
      ],
      sharedContext
    ),
    this.confirmOrderChange(change.id, sharedContext),
  ])

  return returnOrder
}
