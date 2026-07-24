import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import type { OrderDTO } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

import { removeRemoteLinkStep, useQueryGraphStep } from "../../common"
import { deleteDraftOrdersStep } from "../steps"

/**
 * The data to validate the order's cancelation.
 */
export type DeleteDraftOrderStepInput = {
  /**
   * The order ids to delete.
   */
  order_ids: string[]
}

const validateDraftOrdersStep = createStep(
  "validate-draft-orders",
  async (data: { orders: OrderDTO[] }) => {
    if (
      data.orders.some(
        (order) => order.status !== "draft" || !order.is_draft_order
      )
    ) {
      throw new Error("One or more orders are not draft")
    }

    if (data.orders.some((order) => order.deleted_at)) {
      throw new Error("One or more orders are already deleted")
    }
  }
)

export const deleteDraftOrderWorkflowId = "delete-draft-order"
/**
 * This workflow deletes draft orders. It's used by the [Delete Draft Order API route](https://docs.medusajs.com/api/admin/draft-orders/delete-a-draft-order).
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around deleting a draft order.
 *
 * @example
 * const { result } = await deleteDraftOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_ids: ["order_123", "order_456"],
 *   }
 * })
 *
 * @summary
 *
 * Delete draft orders.
 */
export const deleteDraftOrdersWorkflow = createWorkflow(
  deleteDraftOrderWorkflowId,
  (input: WorkflowData<DeleteDraftOrderStepInput>) => {
    const orderQuery = useQueryGraphStep({
      entity: "orders",
      fields: ["id", "status", "is_draft_order", "deleted_at"],
      filters: { id: input.order_ids },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-draft-order" })

    const orders = transform({ orderQuery }, ({ orderQuery }) => {
      return orderQuery.data
    })

    validateDraftOrdersStep({ orders })

    removeRemoteLinkStep({
      [Modules.ORDER]: { order_id: input.order_ids },
    })

    deleteDraftOrdersStep({ orderIds: input.order_ids })

    return new WorkflowResponse(void 0)
  }
)
