import {
  FilterableCustomerAddressProps,
  CustomerAddressDTO,
  UpdateCustomerAddressDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
  updateCustomerAddressesStep,
} from "../steps"

type WorkflowInput = {
  selector: FilterableCustomerAddressProps
  update: UpdateCustomerAddressDTO
}

export const updateCustomerAddressesWorkflowId = "update-customer-addresses"
export const updateCustomerAddressesWorkflow = createWorkflow(
  updateCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerAddressDTO[]> => {
    const unsetInput = transform(input, (data) => ({
      update: data,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    return updateCustomerAddressesStep(input)
  }
)
