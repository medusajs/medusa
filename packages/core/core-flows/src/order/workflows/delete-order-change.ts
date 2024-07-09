import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteOrderChangeStep } from "../steps"

export const deleteOrderChangeWorkflowId = "delete-order-change"
export const deleteOrderChangeWorkflow = createWorkflow(
  deleteOrderChangeWorkflowId,
  (input: WorkflowData<{ id: string }>): WorkflowData<void> => {
    deleteOrderChangeStep(input)
  }
)
