import {
  BigNumberInput,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderReturnItemDTO,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  InventoryLevelWorkflowEvents,
  MathBN,
  OrderChangeStatus,
  OrderWorkflowEvents,
  ReturnStatus,
  deepFlatMap,
} from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../../common"
import { adjustInventoryLevelsStep } from "../../../inventory/steps"
import {
  previewOrderChangeStep,
  updateReturnItemsStep,
  updateReturnsStep,
} from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrUpdateOrderPaymentCollectionWorkflow } from "../create-or-update-order-payment-collection"

/**
 * The data to validate that a return receival can be confirmed.
 */
export type ConfirmReceiveReturnValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that a return receival can be confirmed.
 * If the order or return is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = confirmReceiveReturnValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other order return details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   }
 * })
 */
export const confirmReceiveReturnValidationStep = createStep(
  "validate-confirm-return-receive",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: ConfirmReceiveReturnValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

// Loop through the items in the return and prepare the inventory adjustment of items associated with each variant
function prepareInventoryUpdate({ orderReturn, returnedQuantityMap }) {
  const inventoryAdjustment: {
    inventory_item_id: string
    location_id: string
    adjustment: BigNumberInput
  }[] = []

  let hasManagedInventory = false
  let hasStockLocation = false

  const productVariantInventoryItems = new Map<string, any>()

  // Create the map of inventory item ids associated with each variant that have inventory management
  deepFlatMap(
    orderReturn.items,
    "item.variant.inventory_items.inventory.location_levels",
    ({ variant, inventory_items, location_levels }) => {
      if (!variant?.manage_inventory) {
        return
      }
      hasManagedInventory = true

      if (location_levels?.location_id !== orderReturn.location_id) {
        return
      }
      hasStockLocation = true

      if (!inventory_items) {
        return
      }

      const inventoryItemId = inventory_items.inventory_item_id

      if (!productVariantInventoryItems.has(inventoryItemId)) {
        productVariantInventoryItems.set(inventoryItemId, {
          variant_id: inventory_items.variant_id,
          inventory_item_id: inventoryItemId,
          required_quantity: inventory_items.required_quantity,
        })
      }
    }
  )

  if (hasManagedInventory && !hasStockLocation) {
    throw new Error(
      `Cannot receive the Return at location ${orderReturn.location_id}`
    )
  }

  // Adjust the inventory of all inventory items of each variant in the return
  for (const [variantId, quantity] of Object.entries(returnedQuantityMap)) {
    const inventoryItemsByVariant = Array.from(
      productVariantInventoryItems.values()
    ).filter((i) => i.variant_id === variantId)

    for (const inventoryItem of inventoryItemsByVariant) {
      inventoryAdjustment.push({
        inventory_item_id: inventoryItem.inventory_item_id,
        location_id: orderReturn.location_id,
        adjustment: MathBN.mult(
          quantity as number,
          inventoryItem.required_quantity
        ),
      })
    }
  }

  return inventoryAdjustment
}

/**
 * The data to confirm a return receival request.
 */
export type ConfirmReceiveReturnRequestWorkflowInput = {
  /**
   * The ID of the return to confirm the receival for.
   */
  return_id: string
  /**
   * The ID of the user that's confirming the return receival.
   */
  confirmed_by?: string
}

export const confirmReturnReceiveWorkflowId = "confirm-return-receive"
/**
 * This workflow confirms a return receival request. It's used by the
 * [Confirm Return Receival Admin API Route](https://docs.medusajs.com/api/admin/returns/confirm-return-receival).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to confirm a return receival in your custom flow.
 *
 * @example
 * const { result } = await confirmReturnReceiveWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *   }
 * })
 *
 * @summary
 *
 * Confirm a return receival request.
 */
export const confirmReturnReceiveWorkflow = createWorkflow(
  confirmReturnReceiveWorkflowId,
  function (
    input: ConfirmReceiveReturnRequestWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: [
        "id",
        "status",
        "order_id",
        "location_id",
        "canceled_at",
        "items.*",
        "items.item.variant_id",
        "items.item.variant.manage_inventory",
        "items.item.variant.inventory_items.inventory_item_id",
        "items.item.variant.inventory_items.required_quantity",
        "items.item.variant.inventory_items.inventory.location_levels.location_id",
      ],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "status",
        "actions.id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const { updateReturnItem, returnedQuantityMap, updateReturn } = transform(
      { orderChange, orderReturn },
      (data) => {
        const returnedQuantityMap: Record<string, BigNumberInput> = {}

        const retItems: OrderReturnItemDTO[] = data.orderReturn.items ?? []
        const received: OrderChangeActionDTO[] = []

        data.orderChange.actions.forEach((act) => {
          if (
            [
              ChangeActionType.RECEIVE_RETURN_ITEM,
              ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
            ].includes(act.action as ChangeActionType)
          ) {
            received.push(act)

            if (act.action === ChangeActionType.RECEIVE_RETURN_ITEM) {
              const itemId = act.details!.reference_id as string

              const variantId = (retItems as any).find(
                (i: any) => i.item_id === itemId
              )?.item?.variant_id

              if (!variantId) {
                return
              }

              const currentQuantity = returnedQuantityMap[variantId] ?? 0
              returnedQuantityMap[variantId] = MathBN.add(
                currentQuantity,
                act.details!.quantity as number
              )
            }
          }
        })

        const itemMap = retItems.reduce((acc, item: any) => {
          acc[item.item_id] = item.id
          return acc
        }, {})

        const itemUpdates = {}
        received.forEach((act) => {
          const itemId = act.details!.reference_id as string
          if (itemUpdates[itemId]) {
            itemUpdates[itemId].received_quantity = MathBN.add(
              itemUpdates[itemId].received_quantity,
              act.details!.quantity as BigNumberInput
            )

            if (act.action === ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM) {
              itemUpdates[itemId].damaged_quantity = MathBN.add(
                itemUpdates[itemId].damaged_quantity,
                act.details!.quantity as BigNumberInput
              )
            }

            return
          }

          itemUpdates[itemId] = {
            id: itemMap[itemId],
            received_quantity: act.details!.quantity,
            damaged_quantity:
              act.action === ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM
                ? act.details!.quantity
                : 0,
          }
        })

        const hasReceivedAllItems = retItems.every((item) => {
          const received = itemUpdates[item.item_id]
            ? itemUpdates[item.item_id].received_quantity
            : item.received_quantity

          return MathBN.eq(received, item.quantity)
        })
        const updateReturnData = hasReceivedAllItems
          ? { status: ReturnStatus.RECEIVED, received_at: new Date() }
          : { status: ReturnStatus.PARTIALLY_RECEIVED }

        const updateReturn = {
          id: data.orderReturn.id,
          ...updateReturnData,
        }

        return {
          updateReturnItem: Object.values(itemUpdates) as any,
          returnedQuantityMap,
          updateReturn,
        }
      }
    )

    const inventoryAdjustment = transform(
      { orderReturn, input, returnedQuantityMap },
      prepareInventoryUpdate
    )

    confirmReceiveReturnValidationStep({ order, orderReturn, orderChange })

    const [, , , adjustedLevels] = parallelize(
      updateReturnsStep([updateReturn]),
      updateReturnItemsStep(updateReturnItem),
      confirmOrderChanges({
        changes: [orderChange],
        orderId: order.id,
        confirmed_by: input.confirmed_by,
      }),
      adjustInventoryLevelsStep(inventoryAdjustment)
    )

    const levelUpdatedEvents = transform(
      { adjustedLevels, order },
      ({ adjustedLevels, order }) => {
        return adjustedLevels.map((level) => ({
          id: level.id,
          order_id: order.id,
        }))
      }
    )

    parallelize(
      createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
        input: {
          order_id: order.id,
        },
      }),
      emitEventStep({
        eventName: OrderWorkflowEvents.RETURN_RECEIVED,
        data: {
          order_id: order.id,
          return_id: orderReturn.id,
        },
      }),
      emitEventStep({
        eventName: InventoryLevelWorkflowEvents.UPDATED,
        data: levelUpdatedEvents,
      }).config({ name: "emit-inventory-level-updated" })
    )

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
