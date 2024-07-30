import {
  CustomerDTO,
  CustomerUpdatableFields,
  FilterableCustomerProps,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCustomersStep } from "../steps"

type UpdateCustomersStepInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdatableFields
}

type WorkflowInput = UpdateCustomersStepInput

export const updateCustomersWorkflowId = "update-customers"
export const updateCustomersWorkflow = createWorkflow(
  updateCustomersWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<CustomerDTO[]>> => {
    return new WorkflowResponse(updateCustomersStep(input))
  }
)
