import { Context, OrderTypes } from "@medusajs/types"
import { MathBN, ReturnStatus } from "@medusajs/utils"
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

  const hasReceivedAllItems = returnEntry.items.every((item) => {
    const retItem = items.find((dtItem) => {
      return item.detail.item_id === dtItem.details.reference_id
    })
    const quantity = retItem ? retItem.details.quantity : 0
    return MathBN.eq(
      MathBN.sub(item.detail.return_requested_quantity, quantity),
      0
    )
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
