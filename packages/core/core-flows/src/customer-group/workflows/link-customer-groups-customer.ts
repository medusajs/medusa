import { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { linkCustomerGroupsToCustomerStep } from "../steps"

export const linkCustomerGroupsToCustomerWorkflowId =
  "link-customer-groups-to-customer"
/**
 * This workflow creates one or more links between a customer and customer groups.
 */
export const linkCustomerGroupsToCustomerWorkflow = createWorkflow(
  linkCustomerGroupsToCustomerWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return linkCustomerGroupsToCustomerStep(input)
  }
)
