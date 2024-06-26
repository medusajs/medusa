import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { ChangeActionType } from "../../utils"

function cancelReturnItems(returnRef, actions) {
  return returnRef.items.map((item) => {
    actions.push({
      action: ChangeActionType.CANCEL_RETURN_ITEM,
      return_id: returnRef.id,
      reference: "return",
      reference_id: returnRef.id,
      details: {
        reference_id: item.id,
        return_id: returnRef.id,
        quantity: item.quantity,
      },
    })
  })
}

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
  const returnOrder = await this.orderService_.retrieveReturn(
    data.return_id,
    {
      select: ["id", "items.id", "items.quantity", "shipping_methods.id"],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  cancelReturnItems(returnOrder, actions)

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
            canceled_at: Date.now(),
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
