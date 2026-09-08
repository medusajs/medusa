import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import type { OrderDTO, OrderWorkflow } from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeStep, previewOrderChangeStep } from "../../order"
import { validateDraftOrderStep } from "../steps"
import { acquireLockStep, releaseLockStep } from "../../locking"

export const beginDraftOrderEditWorkflowId = "begin-draft-order-edit"

/**
 * This workflow begins a draft order edit. It's used by the
 * [Create Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin/draft-orders/create-edit).
 *
 * The draft order edit can later be requested using {@link requestDraftOrderEditWorkflow} or confirmed using {@link confirmDraftOrderEditWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * creating a draft order edit request.
 *
 * @example
 * const { result } = await beginDraftOrderEditWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Create a draft order edit request.
 */
export const beginDraftOrderEditWorkflow = createWorkflow(
  beginDraftOrderEditWorkflowId,
  function (input: WorkflowData<OrderWorkflow.BeginorderEditWorkflowInput>) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "is_draft_order"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    validateDraftOrderStep({ order })

    const orderChangeInput = transform({ input }, ({ input }) => {
      return {
        change_type: "edit" as const,
        order_id: input.order_id,
        created_by: input.created_by,
        description: input.description,
        internal_note: input.internal_note,
      }
    })

    createOrderChangeStep(orderChangeInput)

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
