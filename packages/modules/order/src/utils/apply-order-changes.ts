import {
  CreateOrderLineItemAdjustmentDTO,
  InferEntityType,
  OrderChangeActionDTO,
  OrderDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  isDefined,
  MathBN,
} from "@medusajs/framework/utils"
import { OrderCreditLine, OrderItem, OrderShippingMethod } from "@models"
import { calculateOrderChange } from "./calculate-order-change"

export interface ApplyOrderChangeDTO extends OrderChangeActionDTO {
  id: string
  order_id: string
  version: number
  applied: boolean
}

export async function applyChangesToOrder(
  orders: any[],
  actionsMap: Record<string, any[]>,
  options?: {
    addActionReferenceToObject?: boolean
    includeTaxLinesAndAdjustmentsToPreview?: (...args) => void
  }
) {
  const itemsToUpsert: InferEntityType<typeof OrderItem>[] = []
  const creditLinesToUpsert: InferEntityType<typeof OrderCreditLine>[] = []
  const shippingMethodsToUpsert: InferEntityType<typeof OrderShippingMethod>[] =
    []
  const lineItemAdjustmentsToCreate: CreateOrderLineItemAdjustmentDTO[] = []
  const summariesToUpsert: any[] = []
  const orderToUpdate: any[] = []

  const orderEditableAttributes = [
    "customer_id",
    "sales_channel_id",
    "email",
    "no_notification",
  ]

  const calculatedOrders = {}
  for (const order of orders) {
    const calculated = calculateOrderChange({
      order: order as any,
      actions: actionsMap[order.id],
      transactions: order.transactions ?? [],
      options,
    })

    createRawPropertiesFromBigNumber(calculated)

    const version = actionsMap[order.id]?.[0]?.version ?? order.version
    const orderAttributes: {
      version?: number
      customer_id?: string
      email?: string
    } = {}

    // Editable attributes that have changed
    for (const attr of orderEditableAttributes) {
      if (order[attr] !== calculated.order[attr]) {
        orderAttributes[attr] = calculated.order[attr]
      }
    }

    for (const item of calculated.order.items) {
      if (MathBN.lte(item.quantity, 0)) {
        continue
      }

      const isExistingItem = item.id === item.detail?.item_id
      const orderItem = isExistingItem ? (item.detail as any) : item
      const itemId = isExistingItem ? orderItem.item_id : item.id

      const itemToUpsert = {
        id: orderItem.version === version ? orderItem.id : undefined,
        item_id: itemId,
        order_id: order.id,
        version,
        quantity: orderItem.quantity,
        unit_price: item.unit_price ?? orderItem.unit_price,
        compare_at_unit_price:
          item.compare_at_unit_price ?? orderItem.compare_at_unit_price,
        fulfilled_quantity: orderItem.fulfilled_quantity ?? 0,
        delivered_quantity: orderItem.delivered_quantity ?? 0,
        shipped_quantity: orderItem.shipped_quantity ?? 0,
        return_requested_quantity: orderItem.return_requested_quantity ?? 0,
        return_received_quantity: orderItem.return_received_quantity ?? 0,
        return_dismissed_quantity: orderItem.return_dismissed_quantity ?? 0,
        written_off_quantity: orderItem.written_off_quantity ?? 0,
        metadata: orderItem.metadata,
      } as any

      if (version > order.version) {
        item.adjustments?.forEach((adjustment) => {
          lineItemAdjustmentsToCreate.push({
            item_id: itemId,
            version,
            amount: adjustment.amount,
            description: adjustment.description,
            promotion_id: adjustment.promotion_id,
            code: adjustment.code,
            is_tax_inclusive: adjustment.is_tax_inclusive,
          })
        })
      }

      itemsToUpsert.push(itemToUpsert)
    }

    if (version > order.version) {
      // Handle credit line versioning
      for (const creditLine of calculated.order.credit_lines ?? []) {
        const creditLine_ = creditLine as any
        if (!creditLine_) {
          continue
        }

        const isExisting = isDefined(creditLine_.id)

        const upsertCreditLine = {
          id: creditLine_.version === version ? creditLine_.id : undefined,
          order_id: order.id,
          version,
          reference: creditLine_.reference,
          reference_id: creditLine_.reference_id,
          amount: creditLine_.amount,
          raw_amount: creditLine_.raw_amount,
          metadata: isExisting
            ? creditLine_.metadata
            : { ...(creditLine_.metadata ?? {}), created_in_version: version },
        } as any

        creditLinesToUpsert.push(upsertCreditLine)
      }

      // Handle shipping method versioning
      for (const shippingMethod of calculated.order.shipping_methods ?? []) {
        const shippingMethod_ = shippingMethod as any
        const isNewShippingMethod = !isDefined(shippingMethod_?.detail)
        if (!shippingMethod_) {
          continue
        }

        let associatedMethodId
        let hasShippingMethod = false
        if (isNewShippingMethod) {
          associatedMethodId = shippingMethod_.actions?.find((sm) => {
            return (
              sm.action === ChangeActionType.SHIPPING_ADD && sm.reference_id
            )
          })
          hasShippingMethod = !!associatedMethodId
        } else {
          associatedMethodId = shippingMethod_?.detail?.shipping_method_id
        }

        const sm = {
          ...(isNewShippingMethod ? shippingMethod_ : shippingMethod_.detail),
          version,
          shipping_method_id: associatedMethodId,
        } as any

        delete sm.id

        if (!hasShippingMethod) {
          shippingMethodsToUpsert.push(sm)
        }
      }

      orderAttributes.version = version
    }

    // Including tax lines and adjustments for added items and shipping methods
    if (options?.includeTaxLinesAndAdjustmentsToPreview) {
      await options?.includeTaxLinesAndAdjustmentsToPreview(
        calculated.order,
        itemsToUpsert,
        shippingMethodsToUpsert,
        lineItemAdjustmentsToCreate
      )
      decorateCartTotals(calculated.order)
    }

    const orderSummary = order.summary
    const upsertSummary = {
      id: orderSummary?.version === version ? orderSummary.id : undefined,
      order_id: order.id,
      version,
      totals: calculated.getSummaryFromOrder(
        calculated.order as unknown as OrderDTO
      ),
    }

    createRawPropertiesFromBigNumber(upsertSummary)
    summariesToUpsert.push(upsertSummary)

    if (Object.keys(orderAttributes).length > 0) {
      orderToUpdate.push({
        selector: {
          id: order.id,
        },
        data: {
          ...orderAttributes,
        },
      })
    }

    calculatedOrders[order.id] = calculated
  }

  return {
    lineItemAdjustmentsToCreate,
    itemsToUpsert,
    creditLinesToUpsert,
    shippingMethodsToUpsert,
    summariesToUpsert,
    orderToUpdate,
    calculatedOrders,
  }
}
