import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCustomersStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCustomersWorkflowId = "delete-customers"
export const deleteCustomersWorkflow = createWorkflow(
  deleteCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomersStep(input.ids)
  }
)
