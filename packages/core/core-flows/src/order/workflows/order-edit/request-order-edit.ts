import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
} from "@medusajs/framework/types"
import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import { updateOrderChangesStep } from "../../steps/update-order-changes"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrUpdateOrderPaymentCollectionWorkflow } from "../create-or-update-order-payment-collection"

export type OrderEditRequestWorkflowInput = {
  order_id: string
  requested_by?: string
}

/**
 * This step validates that a order edit can be requested.
 */
export const requestOrderEditRequestValidationStep = createStep(
  "validate-order-edit-request",
  async function ({
    order,
    orderChange,
  }: {
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const requestOrderEditRequestWorkflowId = "order-edit-request"
/**
 * This workflow requests an order edit request.
 */
export const requestOrderEditRequestWorkflow = createWorkflow(
  requestOrderEditRequestWorkflowId,
  function (
    input: OrderEditRequestWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "canceled_at"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    requestOrderEditRequestValidationStep({
      order,
      orderChange,
    })

    updateOrderChangesStep([
      {
        id: orderChange.id,
        status: OrderChangeStatus.REQUESTED,
        requested_at: new Date(),
        requested_by: input.requested_by,
      },
    ])

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
