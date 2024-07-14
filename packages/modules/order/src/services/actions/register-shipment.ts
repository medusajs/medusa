import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"

export async function registerShipment(
  this: any,
  data: OrderTypes.RegisterOrderShipmentDTO,
  sharedContext?: Context
): Promise<void> {
  let shippingMethodId

  const actions: CreateOrderChangeActionDTO[] = data.items!.map((item) => {
    return {
      action: ChangeActionType.SHIP_ITEM,
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

  if (shippingMethodId) {
    actions.push({
      action: ChangeActionType.SHIPPING_ADD,
      reference: data.reference,
      reference_id: shippingMethodId,
    })
  }

  const change = await this.createOrderChange_(
    {
      order_id: data.order_id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions,
    },
    sharedContext
  )

  await this.confirmOrderChange(change[0].id, sharedContext)
}
