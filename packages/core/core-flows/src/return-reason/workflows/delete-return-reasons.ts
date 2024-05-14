import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteReturnReasonStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteReturnReasonsWorkflowId = "delete-return-reasons"
export const deleteReturnReasonsWorkflow = createWorkflow(
  deleteReturnReasonsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteReturnReasonStep(input.ids)
  }
)
