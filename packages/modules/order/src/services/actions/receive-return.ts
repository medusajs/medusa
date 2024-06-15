import { Context, OrderTypes } from "@medusajs/types"
import { MathBN, ReturnStatus, promiseAll } from "@medusajs/utils"
import { OrderChangeType } from "@types"
import { ChangeActionType } from "../../utils"

export async function receiveReturn(
  this: any,
  data: OrderTypes.ReceiveOrderReturnDTO,
  sharedContext?: Context
) {
  const returnEntry = await this.retrieveReturn(
    data.return_id,
    {
      select: ["id", "order_id"],
      relations: ["items"],
    },
    sharedContext
  )

  const items = data.items.map((item) => {
    return {
      action: ChangeActionType.RECEIVE_RETURN_ITEM,
      internal_note: item.internal_note,
      reference: data.reference,
      reference_id: data.reference_id,
      details: {
        reference_id: item.id,
        quantity: item.quantity,
        metadata: item.metadata,
      },
    }
  })

  const change = await this.createOrderChange_(
    {
      order_id: returnEntry.order_id,
      return_id: returnEntry.id,
      reference: "return",
      reference_id: returnEntry.id,
      change_type: OrderChangeType.RETURN,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions: items,
    },
    sharedContext
  )

  await this.confirmOrderChange(change[0].id, sharedContext)

  const retItemsToUpdate = returnEntry.items
    .map((item) => {
      const data = items.find((i) => i.details.reference_id === item.item_id)
      if (!data) {
        return
      }

      const receivedQuantity = MathBN.add(
        item.received_quantity || 0,
        data.details.quantity
      )

      item.received_quantity = receivedQuantity
      return {
        id: item.id,
        received_quantity: receivedQuantity,
      }
    })
    .filter(Boolean)

  const hasReceivedAllItems = returnEntry.items.every((item) => {
    return MathBN.eq(item.received_quantity, item.quantity)
  })

  const retData = hasReceivedAllItems
    ? { status: ReturnStatus.RECEIVED, received_at: new Date() }
    : { status: ReturnStatus.PARTIALLY_RECEIVED }

  const [returnRef] = await promiseAll([
    this.updateReturns(
      {
        selector: { id: returnEntry.id },
        data: retData,
      },
      sharedContext
    ),
    this.updateReturnItems(retItemsToUpdate, sharedContext),
  ])

  return returnRef
}
