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
      const orderItem = item.detail as any
      itemsToUpsert.push({
        id: orderItem.version === version ? orderItem.id : undefined,
        item_id: item.id,
        order_id: order.id,
        version,
        return_id: item.detail.return_id,
        claim_id: item.detail.claim_id,
        exchange_id: item.detail.exchange_id,
        quantity: item.detail.quantity,
        fulfilled_quantity: item.detail.fulfilled_quantity,
        shipped_quantity: item.detail.shipped_quantity,
        return_requested_quantity: item.detail.return_requested_quantity,
        return_received_quantity: item.detail.return_received_quantity,
        return_dismissed_quantity: item.detail.return_dismissed_quantity,
        written_off_quantity: item.detail.written_off_quantity,
        metadata: item.detail.metadata,
      } as any)
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
