import { GroupCustomerPair } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCustomerGroupCustomersStep } from "../steps"

type WorkflowInput = { groupCustomers: GroupCustomerPair[] }

export const createCustomerGroupCustomersWorkflowId =
  "create-customer-group-customers"
export const createCustomerGroupCustomersWorkflow = createWorkflow(
  createCustomerGroupCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<{ id: string }[]> => {
    return createCustomerGroupCustomersStep(input.groupCustomers)
  }
)
