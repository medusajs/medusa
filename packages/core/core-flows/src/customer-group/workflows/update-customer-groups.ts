import {
  CustomerGroupDTO,
  FilterableCustomerGroupProps,
  CustomerGroupUpdatableFields,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCustomerGroupsStep } from "../steps"

type WorkflowInput = {
  selector: FilterableCustomerGroupProps
  update: CustomerGroupUpdatableFields
}

export const updateCustomerGroupsWorkflowId = "update-customer-groups"
export const updateCustomerGroupsWorkflow = createWorkflow(
  updateCustomerGroupsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<CustomerGroupDTO[]> => {
    return new WorkflowResponse(updateCustomerGroupsStep(input))
  }
)
