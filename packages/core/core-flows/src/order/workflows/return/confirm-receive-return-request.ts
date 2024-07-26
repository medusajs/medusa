import {
  BigNumberInput,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderReturnItemDTO,
  ReturnDTO,
} from "@medusajs/types"
import {
  ChangeActionType,
  MathBN,
  OrderChangeStatus,
  ReturnStatus,
  deepFlatMap,
} from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
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

type WorkflowInput = {
  return_id: string
}

const validationStep = createStep(
  "validate-confirm-return-receive",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
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

export const confirmReturnReceiveWorkflowId = "confirm-return-receive"
export const confirmReturnReceiveWorkflow = createWorkflow(
  confirmReturnReceiveWorkflowId,
  function (input: WorkflowInput): WorkflowData<OrderDTO> {
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
        "items.item.variant.id",
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
            return
          }

          itemUpdates[itemId] = {
            id: itemMap[itemId],
            received_quantity: act.details!.quantity,
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

    validationStep({ order, orderReturn, orderChange })

    parallelize(
      updateReturnsStep([updateReturn]),
      updateReturnItemsStep(updateReturnItem),
      confirmOrderChanges({ changes: [orderChange], orderId: order.id }),
      adjustInventoryLevelsStep(inventoryAdjustment)
    )

    return previewOrderChangeStep(order.id)
  }
)
