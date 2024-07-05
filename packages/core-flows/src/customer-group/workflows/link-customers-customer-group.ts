import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { linkCustomersToCustomerGroupStep } from "../steps"
import { LinkWorkflowInput } from "@medusajs/types/src"

export const linkCustomersToCustomerGroupWorkflowId =
  "link-customers-to-customer-group"
export const linkCustomersToCustomerGroupWorkflow = createWorkflow(
  linkCustomersToCustomerGroupWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return linkCustomersToCustomerGroupStep(input)
  }
)
