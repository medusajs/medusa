import {
  Context,
  CreateOrderChangeActionDTO,
  OrderTypes,
} from "@medusajs/types"
import {
  ChangeActionType,
  ClaimType,
  OrderChangeType,
  ReturnStatus,
  getShippingMethodsTotals,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { OrderClaim, OrderClaimItem, Return, ReturnItem } from "@models"

function createClaimAndReturnEntities(em, data, order) {
  const claimReference = em.create(OrderClaim, {
    order_id: data.order_id,
    order_version: order.version,
    type: data.type as ClaimType,
    no_notification: data.no_notification,
    refund_amount: (data.refund_amount as unknown) ?? null,
  })

  const returnReference =
    data.type === ClaimType.REPLACE
      ? em.create(Return, {
          order_id: data.order_id,
          order_version: order.version,
          status: ReturnStatus.REQUESTED,
          claim_id: claimReference.id,
          refund_amount: (data.refund_amount as unknown) ?? null,
        })
      : undefined

  claimReference.return_id = returnReference?.id

  return { claimReference, returnReference }
}

function createReturnItem(em, item, claimReference, returnReference, actions) {
  actions.push({
    action: ChangeActionType.RETURN_ITEM,
    reference: "return",
    reference_id: returnReference.id,
    details: {
      reference_id: item.id,
      quantity: item.quantity,
      metadata: item.metadata,
    },
  })

  return em.create(ReturnItem, {
    item_id: item.id,
    return_id: returnReference.id,
    quantity: item.quantity,
    note: item.note,
    metadata: item.metadata,
  })
}

function createClaimAndReturnItems(
  em,
  data,
  claimReference,
  returnReference,
  actions
) {
  const returnItems: ReturnItem[] = []
  const claimItems = data.claim_items?.map((item) => {
    actions.push({
      action: ChangeActionType.WRITE_OFF_ITEM,
      reference: "claim",
      reference_id: claimReference.id,
      details: {
        reference_id: item.id,
        quantity: item.quantity,
        metadata: item.metadata,
      },
    })

    returnItems.push(
      returnReference
        ? createReturnItem(em, item, claimReference, returnReference, actions)
        : undefined
    )

    return em.create(OrderClaimItem, {
      item_id: item.id,
      reason: item.reason,
      quantity: item.quantity,
      note: item.note,
      metadata: item.metadata,
    })
  })

  return [claimItems, returnItems]
}

async function processAdditionalItems(
  em,
  service,
  data,
  order,
  claimReference,
  actions,
  sharedContext
) {
  const itemsToAdd: any[] = []
  const additionalNewItems: OrderClaimItem[] = []
  const additionalItems: OrderClaimItem[] = []
  data.additional_items?.forEach((item) => {
    const hasItem = item.id
      ? order.items.find((o) => o.item.id === item.id)
      : false

    if (hasItem) {
      actions.push({
        action: ChangeActionType.ITEM_ADD,
        claim_id: claimReference.id,
        internal_note: item.internal_note,
        reference: "claim",
        reference_id: claimReference.id,
        details: {
          reference_id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price ?? hasItem.item.unit_price,
          metadata: item.metadata,
        },
      })

      additionalItems.push(
        em.create(OrderClaimItem, {
          item_id: item.id,
          quantity: item.quantity,
          note: item.note,
          metadata: item.metadata,
          is_additional_item: true,
        })
      )
    } else {
      itemsToAdd.push(item)

      additionalNewItems.push(
        em.create(OrderClaimItem, {
          quantity: item.quantity,
          unit_price: item.unit_price,
          note: item.note,
          metadata: item.metadata,
          is_additional_item: true,
        })
      )
    }
  })

  const createItems = await service.lineItemService_.create(
    itemsToAdd,
    sharedContext
  )

  createItems.forEach((item, index) => {
    const addedItem = itemsToAdd[index]
    additionalNewItems[index].item_id = item.id
    actions.push({
      action: ChangeActionType.ITEM_ADD,
      claim_id: claimReference.id,
      internal_note: addedItem.internal_note,
      reference: "claim",
      reference_id: claimReference.id,
      details: {
        reference_id: item.id,
        claim_id: claimReference.id,
        quantity: addedItem.quantity,
        unit_price: item.unit_price,
        metadata: addedItem.metadata,
      },
    })
  })

  return additionalNewItems.concat(additionalItems)
}

async function processShippingMethods(
  service,
  data,
  claimReference,
  actions,
  sharedContext
) {
  for (const shippingMethod of data.shipping_methods ?? []) {
    let shippingMethodId

    if (!isString(shippingMethod)) {
      const methods = await service.createShippingMethods(
        [
          {
            ...shippingMethod,
            order_id: data.order_id,
            claim_id: claimReference.id,
          },
        ],
        sharedContext
      )
      shippingMethodId = methods[0].id
    } else {
      shippingMethodId = shippingMethod
    }

    const method = await service.retrieveShippingMethod(
      shippingMethodId,
      { relations: ["tax_lines", "adjustments"] },
      sharedContext
    )

    const calculatedAmount = getShippingMethodsTotals([method as any], {})[
      method.id
    ]

    actions.push({
      action: ChangeActionType.SHIPPING_ADD,
      reference: "order_shipping_method",
      reference_id: shippingMethodId,
      claim_id: claimReference.id,
      amount: calculatedAmount.total,
    })
  }
}

async function processReturnShipping(
  service,
  data,
  claimReference,
  returnReference,
  actions,
  sharedContext
) {
  if (!returnReference) {
    return
  }

  if (data.return_shipping) {
    let returnShippingMethodId

    if (!isString(data.return_shipping)) {
      const methods = await service.createShippingMethods(
        [
          {
            ...data.return_shipping,
            order_id: data.order_id,
            claim_id: claimReference.id,
            return_id: returnReference.id,
          },
        ],
        sharedContext
      )
      returnShippingMethodId = methods[0].id
    } else {
      returnShippingMethodId = data.return_shipping
    }

    const method = await service.retrieveShippingMethod(
      returnShippingMethodId,
      { relations: ["tax_lines", "adjustments"] },
      sharedContext
    )

    const calculatedAmount = getShippingMethodsTotals([method as any], {})[
      method.id
    ]

    actions.push({
      action: ChangeActionType.SHIPPING_ADD,
      reference: "order_shipping_method",
      reference_id: returnShippingMethodId,
      return_id: returnReference.id,
      claim_id: claimReference.id,
      amount: calculatedAmount.total,
    })
  }
}

export async function createClaim(
  this: any,
  data: OrderTypes.CreateOrderClaimDTO,
  sharedContext?: Context
) {
  const order = await this.orderService_.retrieve(
    data.order_id,
    { relations: ["items"] },
    sharedContext
  )
  const actions: CreateOrderChangeActionDTO[] = []
  const em = sharedContext!.transactionManager as any
  const { claimReference, returnReference } = createClaimAndReturnEntities(
    em,
    data,
    order
  )

  const [claimItems, returnItems] = createClaimAndReturnItems(
    em,
    data,
    claimReference,
    returnReference,
    actions
  )

  claimReference.claim_items = claimItems

  if (returnReference) {
    returnReference.items = returnItems
  }

  claimReference.additional_items = await processAdditionalItems(
    em,
    this,
    data,
    order,
    claimReference,
    actions,
    sharedContext
  )
  await processShippingMethods(
    this,
    data,
    claimReference,
    actions,
    sharedContext
  )
  await processReturnShipping(
    this,
    data,
    claimReference,
    returnReference,
    actions,
    sharedContext
  )

  const change = await this.createOrderChange_(
    {
      order_id: data.order_id,
      claim_id: claimReference.id,
      return_id: returnReference.id,
      change_type: OrderChangeType.CLAIM,
      reference: "claim",
      reference_id: claimReference.id,
      description: data.description,
      internal_note: data.internal_note,
      created_by: data.created_by,
      metadata: data.metadata,
      actions,
    },
    sharedContext
  )

  await promiseAll([
    this.createReturns([returnReference], sharedContext),
    this.createOrderClaims([claimReference], sharedContext),
    this.confirmOrderChange(change[0].id, sharedContext),
  ])

  return claimReference
}
