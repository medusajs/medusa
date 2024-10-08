import {
  FulfillmentDTO,
  OrderDTO,
  RegisterOrderDeliveryDTO,
} from "@medusajs/framework/types"
import { FulfillmentEvents, Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { markFulfillmentAsDeliveredWorkflow } from "../../fulfillment"
import { registerOrderDeliveryStep } from "../steps/register-delivery"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

export const orderFulfillmentDeliverablilityValidationStepId =
  "order-fulfillment-deliverability-validation"
/**
 * This step validates that order & fulfillment are valid
 */
export const orderFulfillmentDeliverablilityValidationStep = createStep(
  orderFulfillmentDeliverablilityValidationStepId,
  async ({
    fulfillment,
    order,
  }: {
    order: OrderDTO & { fulfillments: FulfillmentDTO[] }
    fulfillment: FulfillmentDTO
  }) => {
    throwIfOrderIsCancelled({ order })

    const orderFulfillment = order.fulfillments?.find(
      (f) => f.id === fulfillment.id
    )

    if (!orderFulfillment) {
      throw new Error(
        `Fulfillment with id ${fulfillment.id} not found in the order`
      )
    }

    throwIfItemsDoesNotExistsInOrder({
      order,
      inputItems: order.items!.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      })),
    })
  }
)

function prepareRegisterDeliveryData({
  fulfillment,
  order,
}: {
  fulfillment: FulfillmentDTO
  order: OrderDTO & { fulfillments: FulfillmentDTO[] }
}): RegisterOrderDeliveryDTO {
  const orderFulfillment = order.fulfillments.find(
    (f) => f.id === fulfillment.id
  )!

  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: orderFulfillment.id,
    items: orderFulfillment.items!.map((i) => {
      return {
        id: i.line_item_id!,
        quantity: i.quantity!,
      }
    }),
  }
}

export const markOrderFulfillmentAsDeliveredWorkflowId =
  "mark-order-fulfillment-as-delivered-workflow"
/**
 * This workflow marks a fulfillment in an order as delivered.
 */
export const markOrderFulfillmentAsDeliveredWorkflow = createWorkflow(
  markOrderFulfillmentAsDeliveredWorkflowId,
  (input: WorkflowData<{ orderId: string; fulfillmentId: string }>) => {
    const { fulfillmentId, orderId } = input
    const fulfillment = useRemoteQueryStep({
      entry_point: "fulfillment",
      fields: ["id"],
      variables: { id: fulfillmentId },
      throw_if_key_not_found: true,
      list: false,
    })

    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: [
        "id",
        "summary",
        "currency_code",
        "region_id",
        "fulfillments.id",
        "fulfillments.items.id",
        "fulfillments.items.quantity",
        "fulfillments.items.line_item_id",
        "items.id",
        "items.quantity",
      ],
      variables: { id: orderId },
      throw_if_key_not_found: true,
      list: false,
    }).config({ name: "order-query" })

    orderFulfillmentDeliverablilityValidationStep({ order, fulfillment })

    const deliveryData = transform(
      { order, fulfillment },
      prepareRegisterDeliveryData
    )

    const [deliveredFulfillment] = parallelize(
      markFulfillmentAsDeliveredWorkflow.runAsStep({
        input: { id: fulfillment.id },
      }),
      registerOrderDeliveryStep(deliveryData)
    )

    emitEventStep({
      eventName: FulfillmentEvents.DELIVERY_CREATED,
      data: { id: deliveredFulfillment.id },
    })

    return new WorkflowResponse(void 0)
  }
)
