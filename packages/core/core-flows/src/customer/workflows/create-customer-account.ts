import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { createCustomersStep } from "../steps"
import { transform } from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"

export type CreateCustomerAccountWorkflowInput = {
  authIdentityId: string
  customersData: CreateCustomerDTO
}

export const createCustomerAccountWorkflowId = "create-customer-account"
/**
 * This workflow creates an authentication account for a customer.
 */
export const createCustomerAccountWorkflow = createWorkflow(
  createCustomerAccountWorkflowId,
  (input: WorkflowData<CreateCustomerAccountWorkflowInput>): WorkflowResponse<CustomerDTO> => {
    const customers = createCustomersStep([input.customersData])

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
