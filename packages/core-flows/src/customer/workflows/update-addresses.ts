import {
  FilterableCustomerAddressProps,
  CustomerAddressDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateCustomerAddressesStep } from "../steps"

type WorkflowInput = {
  selector: FilterableCustomerAddressProps
  update: Partial<CustomerAddressDTO>
}

export const updateCustomerAddressesWorkflowId = "update-customer-addresses"
export const updateCustomerAddressesWorkflow = createWorkflow(
  updateCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerAddressDTO[]> => {
    return updateCustomerAddressesStep(input)
  }
)
