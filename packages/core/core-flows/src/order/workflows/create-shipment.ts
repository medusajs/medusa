import {
  AdditionalData,
  FulfillmentDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { FulfillmentEvents, Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { createShipmentWorkflow } from "../../fulfillment"
import { registerOrderShipmentStep } from "../steps"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

/**
 * This step validates that a shipment can be created for an order.
 */
export const createShipmentValidateOrder = createStep(
  "create-shipment-validate-order",
  ({
    order,
    input,
  }: {
    order: OrderDTO
    input: OrderWorkflow.CreateOrderShipmentWorkflowInput
  }) => {
    const inputItems = input.items

    throwIfOrderIsCancelled({ order })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems })

    const order_ = order as OrderDTO & { fulfillments: FulfillmentDTO[] }
    const fulfillment = order_.fulfillments.find(
      (f) => f.id === input.fulfillment_id
    )
    if (!fulfillment) {
      throw new Error(
        `Fulfillment with id ${input.fulfillment_id} not found in the order`
      )
    }
  }
)

function prepareRegisterShipmentData({
  order,
  input,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderShipmentWorkflowInput
}) {
  const fulfillId = input.fulfillment_id
  const order_ = order as OrderDTO & { fulfillments: FulfillmentDTO[] }
  const fulfillment = order_.fulfillments.find((f) => f.id === fulfillId)!

  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    created_by: input.created_by,
    items: (input.items ?? order.items)!.map((i) => {
      return {
        id: i.id,
        quantity: i.quantity,
      }
    }),
  }
}

export const createOrderShipmentWorkflowId = "create-order-shipment"
/**
 * This workflow creates a shipment for an order.
 */
export const createOrderShipmentWorkflow = createWorkflow(
  createOrderShipmentWorkflowId,
  (
    input: WorkflowData<
      OrderWorkflow.CreateOrderShipmentWorkflowInput & AdditionalData
    >
  ) => {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "status",
        "region_id",
        "currency_code",
        "items.*",
        "fulfillments.*",
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    createShipmentValidateOrder({ order, input })

    const fulfillmentData = transform({ input }, ({ input }) => {
      return {
        id: input.fulfillment_id,
        labels: input.labels ?? [],
      }
    })

    const shipmentData = transform(
      { order, input },
      prepareRegisterShipmentData
    )

    const [shipment] = parallelize(
      createShipmentWorkflow.runAsStep({
        input: fulfillmentData,
      }),
      registerOrderShipmentStep(shipmentData)
    )

    emitEventStep({
      eventName: FulfillmentEvents.SHIPMENT_CREATED,
      data: { id: shipment.id },
    })

    const shipmentCreated = createHook("shipmentCreated", {
      shipment,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(void 0, {
      hooks: [shipmentCreated],
    })
  }
)
