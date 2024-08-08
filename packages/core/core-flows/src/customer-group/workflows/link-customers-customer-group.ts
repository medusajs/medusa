import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { linkCustomersToCustomerGroupStep } from "../steps"

export const linkCustomersToCustomerGroupWorkflowId =
  "link-customers-to-customer-group"
/**
 * This workflow creates one or more links between customer and customer group records.
 */
export const linkCustomersToCustomerGroupWorkflow = createWorkflow(
  linkCustomersToCustomerGroupWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return linkCustomersToCustomerGroupStep(input)
  }
)
