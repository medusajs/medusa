import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import {
  ReturnStatus,
  getShippingMethodsTotals,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { Return, ReturnItem } from "@models"
import { OrderChangeType } from "@types"
import { ChangeActionType } from "../../utils"

export async function createReturn(
  this: any,
  data: OrderTypes.CreateOrderReturnDTO,
  sharedContext?: Context
) {
  const order = await this.orderService_.retrieve(
    data.order_id,
    {
      relations: ["items"],
    },
    sharedContext
  )

  const em = sharedContext!.transactionManager as any

  const returnRef = em.create(Return, {
    order_id: data.order_id,
    order_version: order.version,
    status: ReturnStatus.REQUESTED,
    refund_amount: (data.refund_amount as unknown) ?? null,
  })

  const actions: CreateOrderChangeActionDTO[] = []

  returnRef.items = data.items.map((item) => {
    actions.push({
      action: ChangeActionType.RETURN_ITEM,
      return_id: returnRef.id,
      internal_note: item.internal_note,
      reference: "return",
      reference_id: returnRef.id,
      details: {
        reference_id: item.id,
        return_id: returnRef.id,
        quantity: item.quantity,
        metadata: item.metadata,
      },
    })

    return em.create(ReturnItem, {
      reason_id: item.reason_id,
      return_id: returnRef.id,
      item_id: item.id,
      quantity: item.quantity,
      note: item.note,
      metadata: item.metadata,
    })
  })

  let shippingMethodId

  if (!isString(data.shipping_method)) {
    const methods = await this.createShippingMethods(
      [
        {
          order_id: data.order_id,
          return_id: returnRef.id,
          ...data.shipping_method,
        },
      ],
      sharedContext
    )
    shippingMethodId = methods[0].id
  } else {
    shippingMethodId = data.shipping_method
  }

  const method = await this.retrieveShippingMethod(
    shippingMethodId,
    {
      relations: ["tax_lines", "adjustments"],
    },
    sharedContext
  )

  const calculatedAmount = getShippingMethodsTotals([method as any], {})[
    method.id
  ]

  if (shippingMethodId) {
    actions.push({
      action: ChangeActionType.SHIPPING_ADD,
      reference: "order_shipping_method",
      reference_id: shippingMethodId,
      return_id: returnRef.id,
      amount: calculatedAmount.total,
    })
  }

  const change = await this.createOrderChange_(
    {
      order_id: data.order_id,
      return_id: returnRef.id,
      change_type: OrderChangeType.RETURN,
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

  await promiseAll([
    this.createReturns([returnRef], sharedContext),
    this.confirmOrderChange(change[0].id, sharedContext),
  ])

  return returnRef
}
