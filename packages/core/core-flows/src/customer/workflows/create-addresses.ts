import {
  AdditionalData,
  CreateCustomerAddressDTO,
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
  createCustomerAddressesStep,
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
} from "../steps"

export type CreateCustomerAddressesWorkflowInput = {
  addresses: CreateCustomerAddressDTO[]
} & AdditionalData

export const createCustomerAddressesWorkflowId = "create-customer-addresses"
/**
 * This workflow creates one or more customer address.
 */
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (input: WorkflowData<CreateCustomerAddressesWorkflowInput>) => {
    const unsetInput = transform(input, (data) => ({
      create: data.addresses,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    const createdAddresses = createCustomerAddressesStep(input.addresses)
    const addressesCreated = createHook("addressesCreated", {
      addresses: createdAddresses,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdAddresses, {
      hooks: [addressesCreated],
    })
  }
)
