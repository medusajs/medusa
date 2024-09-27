import { Context, OrderTypes } from "@medusajs/framework/types"
import { ChangeActionType } from "@medusajs/framework/utils"

export async function registerDelivery(
  this: any,
  data: OrderTypes.RegisterOrderDeliveryDTO,
  sharedContext?: Context
): Promise<void> {
  const items = data.items?.map((item) => {
    return {
      action: ChangeActionType.DELIVER_ITEM,
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
      order_id: data.order_id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions: items,
    },
    sharedContext
  )

  await this.confirmOrderChange(change[0].id, sharedContext)
}
