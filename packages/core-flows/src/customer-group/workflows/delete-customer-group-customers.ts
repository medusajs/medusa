import { GroupCustomerPair } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCustomerGroupCustomersStep } from "../steps"

type WorkflowInput = { groupCustomers: GroupCustomerPair[] }

export const deleteCustomerGroupCustomersWorkflowId =
  "delete-customer-group-customers"
export const deleteCustomerGroupCustomersWorkflow = createWorkflow(
  deleteCustomerGroupCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerGroupCustomersStep(input.groupCustomers)
  }
)
