import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteReturnReasonStep } from "../steps"

export type DeleteReturnReasonsWorkflowInput = { ids: string[] }

export const deleteReturnReasonsWorkflowId = "delete-return-reasons"
/**
 * This workflow deletes one or more return reasons.
 */
export const deleteReturnReasonsWorkflow = createWorkflow(
  deleteReturnReasonsWorkflowId,
  (
    input: WorkflowData<DeleteReturnReasonsWorkflowInput>
  ): WorkflowData<void> => {
    return deleteReturnReasonStep(input.ids)
  }
)
