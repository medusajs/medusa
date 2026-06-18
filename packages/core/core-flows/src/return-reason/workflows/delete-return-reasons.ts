import { Modules } from "@medusajs/framework/utils"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common"
import { deleteReturnReasonStep } from "../steps"

/**
 * The IDs of return reasons to delete.
 */
export type DeleteReturnReasonsWorkflowInput = {
  /**
   * The IDs of return reasons to delete.
   */
  ids: string[]
}

export const deleteReturnReasonsWorkflowId = "delete-return-reasons"
/**
 * This workflow deletes one or more return reasons. It's used by the
 * [Delete Return Reasons Admin API Route](https://docs.medusajs.com/api/admin#return-reasons_deletereturnreasonsid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete return reasons within your custom flows.
 *
 * @example
 * const { result } = await deleteReturnReasonsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["rr_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete return reasons.
 */
export const deleteReturnReasonsWorkflow = createWorkflow(
  deleteReturnReasonsWorkflowId,
  (
    input: WorkflowData<DeleteReturnReasonsWorkflowInput>
  ): WorkflowData<void> => {
    deleteReturnReasonStep(input.ids)

    removeRemoteLinkStep({
      [Modules.ORDER]: {
        return_reason_id: input.ids,
      },
    })
  }
)
