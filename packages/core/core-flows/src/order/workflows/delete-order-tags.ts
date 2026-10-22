import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteOrderTagsStep } from "../steps"

/**
 * The data to delete one or more order tags.
 */
export type DeleteOrderTagsWorkflowInput = {
  /**
   * The IDs of the order tags to delete.
   */
  ids: string[]
}

export const deleteOrderTagsWorkflowId = "delete-order-tags"
/**
 * This workflow deletes one or more order tags. It's used by the
 * Delete Order Tag Admin API Route.
 *
 * You can also use this workflow within your own custom workflows, allowing
 * you to wrap custom logic around order-tag deletion.
 *
 * @example
 * await deleteOrderTagsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["otag_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more order tags.
 */
export const deleteOrderTagsWorkflow = createWorkflow(
  deleteOrderTagsWorkflowId,
  (input: WorkflowData<DeleteOrderTagsWorkflowInput>) => {
    return new WorkflowResponse(deleteOrderTagsStep(input.ids))
  }
)
