import { CreateCustomerAddressDTO, CustomerAddressDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createCustomerAddressesStep,
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
} from "../steps"

type WorkflowInput = { addresses: CreateCustomerAddressDTO[] }

export const createCustomerAddressesWorkflowId = "create-customer-addresses"
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<CustomerAddressDTO[]> => {
    const unsetInput = transform(input, (data) => ({
      create: data.addresses,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    return new WorkflowResponse(createCustomerAddressesStep(input.addresses))
  }
)
