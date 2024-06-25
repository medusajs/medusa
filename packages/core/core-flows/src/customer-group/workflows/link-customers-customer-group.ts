import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { linkCustomersToCustomerGroupStep } from "../steps"

export const linkCustomersToCustomerGroupWorkflowId =
  "link-customers-to-customer-group"
export const linkCustomersToCustomerGroupWorkflow = createWorkflow(
  linkCustomersToCustomerGroupWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return linkCustomersToCustomerGroupStep(input)
  }
)
