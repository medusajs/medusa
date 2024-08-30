import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { createCustomersStep } from "../steps"
import { validateCustomerAccountCreation } from "../steps/validate-customer-account-creation"

export type CreateCustomerAccountWorkflowInput = {
  authIdentityId: string
  customerData: CreateCustomerDTO
}

export const createCustomerAccountWorkflowId = "create-customer-account"
/**
 * This workflow creates an authentication account for a customer.
 */
export const createCustomerAccountWorkflow = createWorkflow(
  createCustomerAccountWorkflowId,
  (
    input: WorkflowData<CreateCustomerAccountWorkflowInput>
  ): WorkflowResponse<CustomerDTO> => {
    const customerData = validateCustomerAccountCreation(input)

    const customers = createCustomersStep([customerData])

    const customer = transform(
      customers,
      (customers: CustomerDTO[]) => customers[0]
    )

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "customer",
      value: customer.id,
    })

    return new WorkflowResponse(customer)
  }
)
