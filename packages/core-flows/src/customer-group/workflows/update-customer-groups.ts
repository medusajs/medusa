import {
  CustomerGroupDTO,
  FilterableCustomerGroupProps,
  CustomerGroupUpdatableFields,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateCustomerGroupsStep } from "../steps"

type WorkflowInput = {
  selector: FilterableCustomerGroupProps
  update: CustomerGroupUpdatableFields
}

export const updateCustomerGroupsWorkflowId = "update-customer-groups"
export const updateCustomerGroupsWorkflow = createWorkflow(
  updateCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerGroupDTO[]> => {
    return updateCustomerGroupsStep(input)
  }
)
