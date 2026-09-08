import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRefundReasonsStep } from "../steps"

/**
 * The data to delete refund reasons.
 */
export type DeleteRefundReasonsWorkflowInput = {
  /**
   * The refund reasons to delete.
   */
  ids: string[]
}

export const deleteRefundReasonsWorkflowId = "delete-refund-reasons-workflow"
/**
 * This workflow deletes one or more refund reasons. It's used by the
 * [Delete Refund Reason Admin API Route](https://docs.medusajs.com/api/admin/refund-reasons/delete-a-refund-reason).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete refund reasons in your custom flows.
 * 
 * @example
 * const { result } = await deleteRefundReasonsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["refres_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete refund reasons.
 */
export const deleteRefundReasonsWorkflow = createWorkflow(
  deleteRefundReasonsWorkflowId,
  (input: WorkflowData<DeleteRefundReasonsWorkflowInput>): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteRefundReasonsStep(input.ids))
  }
)
