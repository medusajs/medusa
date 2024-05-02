import { OrderTypes } from "@medusajs/types"
import {
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  deduplicate,
  isDefined,
} from "@medusajs/utils"

export function formatOrder(
  order,
  options: {
    includeTotals?: boolean
  }
): OrderTypes.OrderDTO | OrderTypes.OrderDTO[] {
  const isArray = Array.isArray(order)
  const orders = [...(isArray ? order : [order])]

  orders.map((order) => {
    order.items = order.items?.map((orderItem) => {
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

    order.shipping_methods = order.shipping_methods?.map((shippingMethod) => {
      const sm = { ...shippingMethod.shipping_method }

      delete shippingMethod.shipping_method
      return {
        ...sm,
        order_id: shippingMethod.order_id,
        detail: {
          ...shippingMethod,
        },
      }
    })

    order.summary = order.summary?.[0]?.totals

    return options?.includeTotals
      ? createRawPropertiesFromBigNumber(decorateCartTotals(order))
      : order
  })

  return isArray ? orders : orders[0]
}

export function mapRepositoryToOrderModel(config) {
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
