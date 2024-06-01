import { Modules } from "@medusajs/modules-sdk"
import { FulfillmentDTO, OrderDTO, OrderWorkflow } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { cancelFulfillmentWorkflow } from "../../fulfillment"
import { adjustInventoryLevelsStep } from "../../inventory"
import { cancelOrderFulfillmentStep } from "../steps/cancel-fulfillment"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

const validateOrder = createStep(
  "validate-order",
  ({
    order,
    input,
  }: {
    order: OrderDTO & { fulfillments: FulfillmentDTO[] }
    input: OrderWorkflow.CancelOrderFulfillmentWorkflowInput
  }) => {
    throwIfOrderIsCancelled({ order })

    const fulfillment = order.fulfillments.find(
      (f) => f.id === input.fulfillment_id
    )
    if (!fulfillment) {
      throw new Error(
        `Fulfillment with id ${input.fulfillment_id} not found in the order`
      )
    }

    if (fulfillment.shipped_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The fulfillment has already been shipped. Shipped fulfillments cannot be canceled`
      )
    }

    throwIfItemsDoesNotExistsInOrder({
      order,
      inputItems: fulfillment.items.map((i) => ({
        id: i.line_item_id as string,
        quantity: i.quantity,
      })),
    })
  }
)

function prepareCancelOrderFulfillmentData({
  order,
  fulfillment,
}: {
  order: OrderDTO
  fulfillment: FulfillmentDTO
}) {
  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    items: fulfillment.items!.map((i) => {
      return {
        id: i.line_item_id as string,
        quantity: i.quantity,
      }
    }),
  }
}

function prepareInventoryUpdate({
  fulfillment,
}: {
  order: OrderDTO
  fulfillment: FulfillmentDTO
}) {
  const inventoryAdjustment: {
    inventory_item_id: string
    location_id: string
    adjustment: number // TODO: BigNumberInput
  }[] = []

  for (const item of fulfillment.items) {
    inventoryAdjustment.push({
      inventory_item_id: item.inventory_item_id as string,
      location_id: fulfillment.location_id,
      adjustment: item.quantity,
    })
  }

  return {
    inventoryAdjustment,
  }
}

export const cancelOrderFulfillmentWorkflowId = "cancel-order-fulfillment"
export const cancelOrderFulfillmentWorkflow = createWorkflow(
  cancelOrderFulfillmentWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelOrderFulfillmentWorkflowInput>
  ): WorkflowData<void> => {
    const order: OrderDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "orders",
        fields: [
          "id",
          "status",
          "items.*",
          "fulfillments.*",
          "fulfillments.items.*",
        ],
        variables: { id: input.order_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ order, input })

    const fulfillment = transform({ input, order }, ({ input, order }) => {
      return order.fulfillments.find((f) => f.id === input.fulfillment_id)!
    })

    cancelFulfillmentWorkflow.runAsStep({
      input: {
        id: input.fulfillment_id,
      },
    })

    const cancelOrderFulfillmentData = transform(
      { order, fulfillment },
      prepareCancelOrderFulfillmentData
    )

    cancelOrderFulfillmentStep(cancelOrderFulfillmentData)

    const { inventoryAdjustment } = transform(
      { order, fulfillment },
      prepareInventoryUpdate
    )

    adjustInventoryLevelsStep(inventoryAdjustment)
  }
)
