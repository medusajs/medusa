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
      claim_id: returnRef.id,
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

export async function cancelClaim(
  this: any,
  data: OrderTypes.CancelOrderClaimDTO,
  sharedContext?: Context
) {
  const claimOrder = await this.orderService_.retrieveClaim(
    data.claim_id,
    {
      select: [
        "id",
        "return.id",
        "return.items.id",
        "return.items.quantity",
        "claim_items.id",
        "claim_items.quantity",
        "additional_items.id",
        "additional_items.quantity",
      ],
    },
    sharedContext
  )

  const actions: CreateOrderChangeActionDTO[] = []

  claimOrder.return.items.forEach((item) => {
    actions.push({
      action: ChangeActionType.CANCEL_RETURN_ITEM,
      claim_id: claimOrder.id,
      return_id: claimOrder.return.id,
      reference: "return",
      reference_id: claimOrder.return.id,
      details: {
        reference_id: item.id,
        claim_id: claimOrder.id,
        return_id: claimOrder.return.id,
        quantity: item.quantity,
      },
    })
  })

  claimOrder.claim_items.forEach((item) => {
    actions.push({
      action: ChangeActionType.REINSTATE_ITEM,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: claimOrder.id,
      details: {
        reference_id: item.id,
        claim_id: claimOrder.id,
        quantity: item.quantity,
      },
    })
  })

  claimOrder.additional_items.forEach((item) => {
    actions.push({
      action: ChangeActionType.ITEM_REMOVE,
      claim_id: claimOrder.id,
      reference: "claim",
      reference_id: claimOrder.id,
      details: {
        reference_id: item.id,
        claim_id: claimOrder.id,
        quantity: item.quantity,
      },
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
    this.updateClaims(
      [
        {
          data: {
            canceled_at: Date.now(),
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
