import {
  CustomerGroupDTO,
  FilterableCustomerGroupProps,
  CustomerGroupUpdatableFields,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateCustomerGroupsStep } from "../steps"

export type UpdateCustomerGroupsWorkflowInput = {
  selector: FilterableCustomerGroupProps
  update: CustomerGroupUpdatableFields
}

export const updateCustomerGroupsWorkflowId = "update-customer-groups"
/**
 * This workflow updates one or more customer groups.
 */
export const updateCustomerGroupsWorkflow = createWorkflow(
  updateCustomerGroupsWorkflowId,
  (
    input: WorkflowData<UpdateCustomerGroupsWorkflowInput>
  ): WorkflowResponse<CustomerGroupDTO[]> => {
    return new WorkflowResponse(updateCustomerGroupsStep(input))
  }
)
