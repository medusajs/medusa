import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import { ChangeActionType, promiseAll } from "@medusajs/utils"

async function createOrderChange(
  service,
  data,
  claimOrder,
  actions,
  sharedContext
) {
  return await service.createOrderChange_(
    {
      order_id: claimOrder.order_id,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: claimOrder.id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions,
    },
    sharedContext
  )
}

export async function cancelClaim(
  this: any,
  data: OrderTypes.CancelOrderClaimDTO,
  sharedContext?: Context
) {
  const claimOrder = await this.retrieveOrderClaim(
    data.claim_id,
    {
      select: [
        "id",
        "order_id",
        "claim_items.item_id",
        "claim_items.is_additional_item",
        "claim_items.quantity",
        "additional_items.id",
        "additional_items.item_id",
        "additional_items.quantity",
        "additional_items.is_additional_item",
      ],
      relations: ["claim_items", "additional_items", "shipping_methods"],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  claimOrder.claim_items?.forEach((item) => {
    actions.push({
      action: ChangeActionType.REINSTATE_ITEM,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: claimOrder.id,
      details: {
        reference_id: item.item_id,
        quantity: item.quantity,
      },
    })
  })

  claimOrder.additional_items?.forEach((item) => {
    actions.push({
      action: ChangeActionType.ITEM_REMOVE,
      order_id: claimOrder.order_id,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: claimOrder.id,
      details: {
        reference_id: item.item_id,
        quantity: item.quantity,
      },
    })
  })

  claimOrder.shipping_methods?.forEach((shipping) => {
    actions.push({
      action: ChangeActionType.SHIPPING_REMOVE,
      order_id: claimOrder.order_id,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: shipping.id,
      amount: shipping.price,
    })
  })

  const [change] = await createOrderChange(
    this,
    data,
    claimOrder,
    actions,
    sharedContext
  )

  await promiseAll([
    this.updateOrderClaims(
      [
        {
          data: {
            canceled_at: new Date(),
          },
          selector: {
            id: claimOrder.id,
          },
        },
      ],
      sharedContext
    ),
    this.confirmOrderChange(change.id, sharedContext),
  ])

  return claimOrder
}
