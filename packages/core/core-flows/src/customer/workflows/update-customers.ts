import {
  AdditionalData,
  CustomerDTO,
  CustomerUpdatableFields,
  FilterableCustomerProps,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCustomersStep } from "../steps"

type UpdateCustomersStepInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdatableFields
} & AdditionalData

type WorkflowInput = UpdateCustomersStepInput

export const updateCustomersWorkflowId = "update-customers"
export const updateCustomersWorkflow = createWorkflow(
  updateCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const updatedCustomers = updateCustomersStep(input)
    const customersUpdated = createHook("customersUpdated", {
      customers: updatedCustomers,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedCustomers, {
      hooks: [customersUpdated],
    })
  }
)
