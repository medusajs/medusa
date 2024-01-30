import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCustomerStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCustomersWorkflowId = "delete-customers"
export const deleteCustomersWorkflow = createWorkflow(
  deleteCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerStep(input.ids)
  }
)
