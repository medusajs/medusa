import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { BulkTagOrdersStepInput, bulkTagOrdersStep } from "../steps"

export const bulkTagOrdersWorkflowId = "bulk-tag-orders"
/**
 * This workflow adds and/or removes tags across one or more orders in a
 * single call. It's used by the Bulk Tag Orders Admin API Route.
 *
 * If the same tag ID is passed in both `add` and `remove`, removal wins.
 * Every order ID and every referenced tag ID is validated before any order
 * is mutated - if any of them don't exist, the workflow fails and no order
 * is changed.
 *
 * You can also use this workflow within your own custom workflows, allowing
 * you to wrap custom logic around bulk order tagging.
 *
 * @example
 * const { result } = await bulkTagOrdersWorkflow(container)
 * .run({
 *   input: {
 *     order_ids: ["order_123", "order_456"],
 *     add: ["otag_123"],
 *     remove: ["otag_456"]
 *   }
 * })
 *
 * @summary
 *
 * Add and/or remove tags across one or more orders.
 */
export const bulkTagOrdersWorkflow = createWorkflow(
  bulkTagOrdersWorkflowId,
  (input: WorkflowData<BulkTagOrdersStepInput>) => {
    const orders = bulkTagOrdersStep(input)

    return new WorkflowResponse(orders)
  }
)
