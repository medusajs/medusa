import { OrderTypes } from "@medusajs/types"
import {
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  deduplicate,
  isDefined,
} from "@medusajs/utils"

// Reshape the order object to match the OrderDTO
// This function is used to format the order object before returning to the main module methods
export function formatOrder(
  order,
  options: {
    entity: any
    includeTotals?: boolean
  }
): Partial<OrderTypes.OrderDTO> | Partial<OrderTypes.OrderDTO>[] {
  const isArray = Array.isArray(order)
  const orders = [...(isArray ? order : [order])]

  orders.map((order) => {
    let mainOrder = order

    const isRelatedEntity = options?.entity?.name !== "Order"

    // If the entity is a related entity, the original order is located in the order property
    if (isRelatedEntity) {
      if (!order.order) {
        return order
      }

      mainOrder = order.order
    }

    mainOrder.items = mainOrder.items?.map((orderItem) => {
      const detail = { ...orderItem }
      delete detail.order
      delete detail.item

      return {
        ...orderItem.item,
        quantity: detail.quantity,
        raw_quantity: detail.raw_quantity,
        detail,
      }
    })

    if (isRelatedEntity) {
      if (order.return) {
        formatOrderReturn(order.return, mainOrder)
      }

      const entityName = options.entity.name
      if (entityName === "OrderClaim") {
        formatClaim(order)
      } else if (entityName === "OrderExchange") {
        formatExchange(order)
      } else if (entityName === "Return") {
        formatReturn(order)
      }
    }

    if (order.shipping_methods) {
      order.shipping_methods = order.shipping_methods?.map((shippingMethod) => {
        const sm = { ...shippingMethod.shipping_method }

        delete shippingMethod.shipping_method
        cleanNestedRelations(shippingMethod)

        return {
          ...sm,
          order_id: shippingMethod.order_id,
          detail: {
            ...shippingMethod,
          },
        }
      })
    }

    if (mainOrder.summary) {
      mainOrder.summary = mainOrder.summary?.[0]?.totals
    }

    return createRawPropertiesFromBigNumber(
      options?.includeTotals ? decorateCartTotals(order) : order
    )
  })

  return isArray ? orders : orders[0]
}

function cleanNestedRelations(obj) {
  delete obj.order
  delete obj.return
  delete obj.claim
  delete obj.exchange
}

function formatOrderReturn(orderReturn, mainOrder) {
  orderReturn.items?.forEach((orderItem) => {
    const item = mainOrder.items?.find((item) => item.id === orderItem.item_id)

    orderItem.detail = item?.detail
  })
}

function formatClaim(claim) {
  if (claim.additional_items) {
    claim.additional_items = claim.additional_items.filter(
      (item) => item.is_additional_item
    )

    claim.additional_items.forEach((orderItem) => {
      const item = claim.order.items?.find(
        (item) => item.id === orderItem.item_id
      )
      cleanNestedRelations(item)
      orderItem.detail = item?.detail
    })
  }

  if (!claim.claim_items) {
    return
  }

  claim.claim_items = claim.claim_items.filter(
    (item) => !item.is_additional_item
  )
  claim.claim_items.forEach((orderItem) => {
    const item = claim.order.items?.find(
      (item) => item.id === orderItem.item_id
    )

    cleanNestedRelations(item)
    orderItem.detail = item?.detail
  })
}

function formatExchange(exchange) {
  if (!exchange.additional_items) {
    return
  }

  exchange.additional_items.forEach((orderItem) => {
    const item = exchange.order.items?.find(
      (item) => item.id === orderItem.item_id
    )

    cleanNestedRelations(item)
    orderItem.detail = item?.detail
  })
}

function formatReturn(returnOrder) {
  if (!returnOrder.items) {
    return
  }

  returnOrder.items.forEach((orderItem) => {
    const item = returnOrder.order.items?.find(
      (item) => item.id === orderItem.item_id
    )

    cleanNestedRelations(item)
    orderItem.detail = item?.detail
  })
}

// Map the public order model to the repository model format
// As the public responses have a different shape than the repository responses, this function is used to map the public properties to the internal db entities
// e.g "items" is the relation between "line-item" and "order" + "version", The line item itself is in "items.item"
// This helper maps to the correct repository to query the DB, and the function "formatOrder" remap the response to the public shape
export function mapRepositoryToOrderModel(config, isRelatedEntity = false) {
  if (isRelatedEntity) {
    return mapRepositoryToRelatedEntity(config)
  }

  const conf = { ...config }

  function replace(obj, type): string[] | undefined {
    if (!isDefined(obj[type])) {
      return
    }

    return deduplicate(
      obj[type].sort().map((rel) => {
        if (rel == "items.quantity") {
          if (type === "fields") {
            obj.populate.push("items.item")
          }
          return "items.item.quantity"
        }
        if (rel == "summary" && type === "fields") {
          obj.populate.push("summary")
          return "summary.totals"
        } else if (
          rel.includes("shipping_methods") &&
          !rel.includes("shipping_methods.shipping_method")
        ) {
          obj.populate.push("shipping_methods.shipping_method")

          return rel.replace(
            "shipping_methods",
            "shipping_methods.shipping_method"
          )
        } else if (rel.includes("items.detail")) {
          return rel.replace("items.detail", "items")
        } else if (rel == "items") {
          return "items.item"
        } else if (rel.includes("items.") && !rel.includes("items.item")) {
          return rel.replace("items.", "items.item.")
        }
        return rel
      })
    )
  }

  conf.options.fields = replace(config.options, "fields")
  conf.options.populate = replace(config.options, "populate")

  if (conf.where?.items) {
    const original = { ...conf.where.items }
    if (original.detail) {
      delete conf.where.items.detail
    }

    conf.where.items = {
      item: conf.where?.items,
    }

    if (original.quantity) {
      conf.where.items.quantity = original.quantity
      delete conf.where.items.item.quantity
    }

    if (original.detail) {
      conf.where.items = {
        ...original.detail,
        ...conf.where.items,
      }
    }
  }

  return conf
}

// This function has the same purpose as "mapRepositoryToOrderModel" but for returns, claims and exchanges
function mapRepositoryToRelatedEntity(config) {
  const conf = { ...config }

  function replace(obj, type): string[] | undefined {
    if (!isDefined(obj[type])) {
      return
    }

    return deduplicate(
      obj[type].sort().map((rel) => {
        if (
          rel.includes("shipping_methods") &&
          !rel.includes("shipping_methods.shipping_method")
        ) {
          obj.populate.push("shipping_methods.shipping_method")

          return rel.replace(
            "shipping_methods",
            "shipping_methods.shipping_method"
          )
        }
        return rel
      })
    )
  }

  conf.options.fields = replace(config.options, "fields")
  conf.options.populate = replace(config.options, "populate")

  return conf
}
