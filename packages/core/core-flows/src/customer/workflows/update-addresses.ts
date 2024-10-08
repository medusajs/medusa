import {
  FilterableCustomerAddressProps,
  UpdateCustomerAddressDTO,
  AdditionalData,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
  updateCustomerAddressesStep,
} from "../steps"

export type UpdateCustomerAddressesWorkflowInput = {
  selector: FilterableCustomerAddressProps
  update: UpdateCustomerAddressDTO
} & AdditionalData

export const updateCustomerAddressesWorkflowId = "update-customer-addresses"
/**
 * This workflow updates one or more customer addresses.
 */
export const updateCustomerAddressesWorkflow = createWorkflow(
  updateCustomerAddressesWorkflowId,
  (input: WorkflowData<UpdateCustomerAddressesWorkflowInput>) => {
    const unsetInput = transform(input, (data) => ({
      update: data,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    const updatedAddresses = updateCustomerAddressesStep(input)
    const addressesUpdated = createHook("addressesUpdated", {
      addresses: updatedAddresses,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedAddresses, {
      hooks: [addressesUpdated],
    })
  }
)
