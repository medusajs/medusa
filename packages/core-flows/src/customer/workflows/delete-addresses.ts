import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCustomerAddressesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCustomerAddressesWorkflowId = "delete-customer-addresses"
export const deleteCustomerAddressesWorkflow = createWorkflow(
  deleteCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCustomerAddressesStep(input.ids)
  }
)
