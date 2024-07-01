import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import {
  ReturnStatus,
  getShippingMethodsTotals,
  isDefined,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { Return, ReturnItem } from "@models"
import { OrderChangeType } from "@types"
import { ChangeActionType } from "../../utils"

function createReturnReference(em, data, order) {
  return em.create(Return, {
    order_id: data.order_id,
    order_version: order.version,
    status: ReturnStatus.REQUESTED,
    no_notification: data.no_notification,
    refund_amount: (data.refund_amount as unknown) ?? null,
  })
}

function createReturnItems(em, data, returnRef, actions) {
  return data.items.map((item) => {
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
}

async function processShippingMethod(
  service,
  data,
  returnRef,
  actions,
  sharedContext
) {
  let shippingMethodId

  if (!isDefined(data.shipping_method)) {
    return
  }

  if (!isString(data.shipping_method)) {
    const methods = await service.createShippingMethods(
      [
        {
          ...data.shipping_method,
          order_id: data.order_id,
          return_id: returnRef.id,
        },
      ],
      sharedContext
    )
    shippingMethodId = methods[0].id
  } else {
    shippingMethodId = data.shipping_method
  }

  const method = await service.retrieveShippingMethod(
    shippingMethodId,
    { relations: ["tax_lines", "adjustments"] },
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
      amount: calculatedAmount.total,
      details: {
        order_id: returnRef.order_id,
        return_id: returnRef.id,
      },
    })
  }
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
}

export async function createReturn(
  this: any,
  data: OrderTypes.CreateOrderReturnDTO,
  sharedContext?: Context
) {
  const order = await this.orderService_.retrieve(
    data.order_id,
    { relations: ["items"] },
    sharedContext
  )

  const em = sharedContext!.transactionManager as any
  const returnRef = createReturnReference(em, data, order)
  const actions: CreateOrderChangeActionDTO[] = []

  returnRef.items = createReturnItems(em, data, returnRef, actions)

  await processShippingMethod(this, data, returnRef, actions, sharedContext)

  const change = await createOrderChange(
    this,
    data,
    returnRef,
    actions,
    sharedContext
  )

  await promiseAll([
    this.createReturns([returnRef], sharedContext),
    this.confirmOrderChange(change[0].id, sharedContext),
  ])

  return returnRef
}
