import { Context, OrderTypes } from "@medusajs/types"
import { MathBN, ReturnStatus, promiseAll } from "@medusajs/utils"
import { ChangeActionType, applyChangesToOrder } from "../../utils"

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
      reference: "return",
      reference_id: returnEntry.id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions: items,
    },
    sharedContext
  )

  await this.confirmOrderChange(change[0].id, sharedContext)

  const orderItemMap = {}
  const presentItems: string[] = []
  for (const item of items) {
    const retItem = returnEntry.items.find((i) => {
      return i.detail.item_id === item.details.reference_id
    })
    presentItems.push(retItem.id)
    orderItemMap[retItem.id] = {
      id: retItem.detail.id,
      return_id: retItem.detail.return_id,
    }
  }

  const returnCopy = JSON.parse(JSON.stringify(returnEntry))
  returnCopy.items = returnCopy.items.filter((item) =>
    presentItems.includes(item.id)
  )

  const { itemsToUpsert, shippingMethodsToInsert } = applyChangesToOrder(
    [returnCopy],
    {
      [returnCopy.id]: items,
    }
  )

  await promiseAll([
    itemsToUpsert.length
      ? this.returnItemService_.upsert(itemsToUpsert, sharedContext)
      : null,
    /*
    shippingMethodsToInsert.length
      ? this.orderShippingMethodService_.create(
          shippingMethodsToInsert,
          sharedContext
        )
      : null,
      */
  ])

  const hasReceivedAllItems = returnEntry.items.every((item) => {
    const refItem =
      itemsToUpsert.find((i) => i.item_id === item.detail.item_id) ??
      item.detail

    return MathBN.eq(refItem.return_requested_quantity, 0)
  })

  const retData = hasReceivedAllItems
    ? { status: ReturnStatus.RECEIVED, received_at: new Date() }
    : { status: ReturnStatus.PARTIALLY_RECEIVED }

  const returnRef = await this.updateReturns(
    {
      selector: { id: returnEntry.id },
      data: retData,
    },
    sharedContext
  )

  return returnRef
}
