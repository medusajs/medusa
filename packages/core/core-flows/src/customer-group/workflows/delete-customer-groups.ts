import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteCustomerGroupStep } from "../steps"

export type DeleteCustomerGroupsWorkflowInput = { ids: string[] }

export const deleteCustomerGroupsWorkflowId = "delete-customer-groups"
/**
 * This workflow deletes one or more customer groups.
 */
export const deleteCustomerGroupsWorkflow = createWorkflow(
  deleteCustomerGroupsWorkflowId,
  (
    input: WorkflowData<DeleteCustomerGroupsWorkflowInput>
  ): WorkflowData<void> => {
    return deleteCustomerGroupStep(input.ids)
  }
)
