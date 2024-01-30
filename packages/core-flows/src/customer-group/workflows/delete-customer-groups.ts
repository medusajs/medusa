import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCustomerGroupStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCustomerGroupsWorkflowId = "delete-customers"
export const deleteCustomerGroupsWorkflow = createWorkflow(
  deleteCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerGroupStep(input.ids)
  }
)
