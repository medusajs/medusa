import { CreateCustomerAddressDTO, CustomerAddressDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCustomerAddressesStep } from "../steps"

type WorkflowInput = { addresses: CreateCustomerAddressDTO[] }

export const createCustomerAddressesWorkflowId = "create-customer-addresses"
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerAddressDTO[]> => {
    return createCustomerAddressesStep(input.addresses)
  }
)
