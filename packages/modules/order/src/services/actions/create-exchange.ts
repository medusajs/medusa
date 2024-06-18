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
import { ExchangeItem, OrderExchange, Return, ReturnItem } from "@models"
import { OrderChangeType } from "@types"
import { ChangeActionType } from "../../utils"

function createExchangeAndReturnEntities(em, data, order) {
  const exchangeReference = em.create(OrderExchange, {
    order_id: data.order_id,
    order_version: order.version,
    no_notification: data.no_notification,
    allow_backorder: data.allow_backorder,
    difference_due: data.difference_due,
  })

  const returnReference = em.create(Return, {
    order_id: data.order_id,
    order_version: order.version,
    status: ReturnStatus.REQUESTED,
    exchange_id: exchangeReference.id,
    refund_amount: (data.refund_amount as unknown) ?? null,
  })

  exchangeReference.return_id = returnReference.id

  return { exchangeReference, returnReference }
}

function createReturnItems(
  em,
  data,
  exchangeReference,
  returnReference,
  actions
) {
  return data.return_items?.map((item) => {
    actions.push({
      action: ChangeActionType.RETURN_ITEM,
      reference: "return",
      reference_id: returnReference.id,
      details: {
        reference_id: item.id,
        return_id: returnReference.id,
        exchange_id: exchangeReference.id,
        quantity: item.quantity,
        metadata: item.metadata,
      },
    })

    return em.create(ReturnItem, {
      item_id: item.id,
      return_id: returnReference.id,
      reason: item.reason,
      quantity: item.quantity,
      note: item.note,
      metadata: item.metadata,
    })
  })
}

async function processAdditionalItems(
  em,
  service,
  data,
  order,
  exchangeReference,
  actions,
  sharedContext
) {
  const itemsToAdd: any[] = []
  const additionalNewItems: ExchangeItem[] = []
  const additionalItems: ExchangeItem[] = []
  data.additional_items?.forEach((item) => {
    const hasItem = item.id
      ? order.items.find((o) => o.item.id === item.id)
      : false

    if (hasItem) {
      actions.push({
        action: ChangeActionType.ITEM_ADD,
        exchange_id: exchangeReference.id,
        internal_note: item.internal_note,
        reference: "exchange",
        reference_id: exchangeReference.id,
        details: {
          reference_id: item.id,
          exchange_id: exchangeReference.id,
          quantity: item.quantity,
          metadata: item.metadata,
        },
      })

      additionalItems.push(
        em.create(ExchangeItem, {
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
        em.create(ExchangeItem, {
          quantity: item.quantity,
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
      exchange_id: exchangeReference.id,
      internal_note: addedItem.internal_note,
      reference: "exchange",
      reference_id: exchangeReference.id,
      details: {
        reference_id: item.id,
        exchange_id: exchangeReference.id,
        quantity: addedItem.quantity,
        metadata: addedItem.metadata,
      },
    })
  })

  return additionalNewItems.concat(additionalItems)
}

async function processShippingMethods(
  service,
  data,
  exchangeReference,
  actions,
  sharedContext
) {
  for (const shippingMethod of data.shipping_methods ?? []) {
    let shippingMethodId

    if (!isString(shippingMethod)) {
      const methods = await service.createShippingMethods(
        [
          {
            order_id: data.order_id,
            exchange_id: exchangeReference.id,
            ...shippingMethod,
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
      exchange_id: exchangeReference.id,
      amount: calculatedAmount.total,
    })
  }
}

async function processReturnShipping(
  service,
  data,
  exchangeReference,
  returnReference,
  actions,
  sharedContext
) {
  let returnShippingMethodId

  if (!isString(data.return_shipping)) {
    const methods = await service.createShippingMethods(
      [
        {
          order_id: data.order_id,
          exchange_id: exchangeReference.id,
          return_id: returnReference.id,
          ...data.return_shipping,
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
    exchange_id: exchangeReference.id,
    amount: calculatedAmount.total,
  })
}

export async function createExchange(
  this: any,
  data: OrderTypes.CreateOrderExchangeDTO,
  sharedContext?: Context
) {
  const order = await this.orderService_.retrieve(
    data.order_id,
    { relations: ["items"] },
    sharedContext
  )
  const actions: CreateOrderChangeActionDTO[] = []
  const em = sharedContext!.transactionManager as any
  const { exchangeReference, returnReference } =
    createExchangeAndReturnEntities(em, data, order)

  returnReference.items = createReturnItems(
    em,
    data,
    exchangeReference,
    returnReference,
    actions
  )

  exchangeReference.additional_items = await processAdditionalItems(
    em,
    this,
    data,
    order,
    exchangeReference,
    actions,
    sharedContext
  )
  await processShippingMethods(
    this,
    data,
    exchangeReference,
    actions,
    sharedContext
  )
  await processReturnShipping(
    this,
    data,
    exchangeReference,
    returnReference,
    actions,
    sharedContext
  )

  const change = await this.createOrderChange_(
    {
      order_id: data.order_id,
      exchange_id: exchangeReference.id,
      return_id: returnReference.id,
      change_type: OrderChangeType.CLAIM,
      reference: "exchange",
      reference_id: exchangeReference.id,
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
    this.createOrderExchanges([exchangeReference], sharedContext),
    this.confirmOrderChange(change[0].id, sharedContext),
  ])

  return exchangeReference
}
