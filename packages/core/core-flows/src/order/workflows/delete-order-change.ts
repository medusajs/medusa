import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteOrderChangesStep } from "../steps"

export const deleteOrderChangeWorkflowId = "delete-order-change"
export const deleteOrderChangeWorkflow = createWorkflow(
  deleteOrderChangeWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    deleteOrderChangesStep(input)
  }
)
