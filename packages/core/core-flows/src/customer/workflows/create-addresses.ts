import { AdditionalData, CreateCustomerAddressDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createCustomerAddressesStep,
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
} from "../steps"

type WorkflowInput = { addresses: CreateCustomerAddressDTO[] } & AdditionalData

export const createCustomerAddressesWorkflowId = "create-customer-addresses"
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
