import { OrderChangeActionDTO } from "@medusajs/types"
import { createRawPropertiesFromBigNumber } from "@medusajs/utils"
import { OrderItem, OrderShippingMethod } from "@models"
import { calculateOrderChange } from "./calculate-order-change"

export interface ApplyOrderChangeDTO extends OrderChangeActionDTO {
  id: string
  order_id: string
  version: number
  applied: boolean
}

export function applyChangesToOrder(
  orders: any[],
  actionsMap: Record<string, any[]>
) {
  const itemsToUpsert: OrderItem[] = []
  const shippingMethodsToInsert: OrderShippingMethod[] = []
  const summariesToUpsert: any[] = []
  const orderToUpdate: any[] = []

  for (const order of orders) {
    const calculated = calculateOrderChange({
      order: order as any,
      actions: actionsMap[order.id],
      transactions: order.transactions ?? [],
    })

    createRawPropertiesFromBigNumber(calculated)

    const version = actionsMap[order.id][0].version ?? 1

    for (const item of calculated.order.items) {
      const orderItem = (item.detail as any) ?? item
      const itemId = item.detail ? orderItem.item_id : item.id

      itemsToUpsert.push({
        id: orderItem.version === version ? orderItem.id : undefined,
        item_id: itemId,
        order_id: order.id,
        version,
        quantity: orderItem.quantity,
        fulfilled_quantity: orderItem.fulfilled_quantity,
        shipped_quantity: orderItem.shipped_quantity,
        return_requested_quantity: orderItem.return_requested_quantity,
        return_received_quantity: orderItem.return_received_quantity,
        return_dismissed_quantity: orderItem.return_dismissed_quantity,
        written_off_quantity: orderItem.written_off_quantity,
        metadata: orderItem.metadata,
      } as OrderItem)
    }

    const orderSummary = order.summary as any
    summariesToUpsert.push({
      id: orderSummary?.version === version ? orderSummary.id : undefined,
      order_id: order.id,
      version,
      totals: calculated.summary,
    })

    if (version > order.version) {
      for (const shippingMethod of calculated.order.shipping_methods ?? []) {
        if (!shippingMethod) {
          continue
        }

        const sm = {
          ...((shippingMethod as any).detail ?? shippingMethod),
          version,
        }
        delete sm.id
        shippingMethodsToInsert.push(sm)
      }

      orderToUpdate.push({
        selector: {
          id: order.id,
        },
        data: {
          version,
        },
      })
    }
  }

  return {
    itemsToUpsert,
    shippingMethodsToInsert,
    summariesToUpsert,
    orderToUpdate,
  }
}
