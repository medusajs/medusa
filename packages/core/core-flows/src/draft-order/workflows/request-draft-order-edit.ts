import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import type { OrderChangeDTO, OrderDTO } from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrUpdateOrderPaymentCollectionWorkflow,
  previewOrderChangeStep,
  updateOrderChangesStep,
} from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { acquireLockStep, releaseLockStep } from "../../locking"

export const requestDraftOrderEditId = "request-draft-order-edit"

function getOrderChangesData({
  input,
  orderChange,
}: {
  input: { requested_by?: string }
  orderChange: { id: string }
}) {
  return transform({ input, orderChange }, ({ input, orderChange }) => {
    return [
      {
        id: orderChange.id,
        status: OrderChangeStatus.REQUESTED,
        requested_at: new Date(),
        requested_by: input.requested_by,
      },
    ]
  })
}

/**
 * The data to request a draft order edit.
 */
export type RequestDraftOrderEditWorkflowInput = {
  /**
   * The ID of the draft order to request the edit for.
   */
  order_id: string
  /**
   * The ID of the user requesting the edit.
   */
  requested_by?: string
}

/**
 * This workflow requests a draft order edit. It's used by the
 * [Request Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin/draft-orders/request-edit).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * requesting a draft order edit.
 *
 * @example
 * const { result } = await requestDraftOrderEditWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     requested_by: "user_123",
 *   }
 * })
 *
 * @summary
 *
 * Request a draft order edit.
 */
export const requestDraftOrderEditWorkflow = createWorkflow(
  requestDraftOrderEditId,
  function (input: RequestDraftOrderEditWorkflowInput) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "status", "is_draft_order", "canceled_at"],
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

    validateDraftOrderChangeStep({
      order,
      orderChange,
    })

    const updateOrderChangesData = getOrderChangesData({ input, orderChange })
    updateOrderChangesStep(updateOrderChangesData)

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
