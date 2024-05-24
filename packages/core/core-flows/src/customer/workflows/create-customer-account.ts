import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { createCustomersStep } from "../steps"
import { transform } from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/modules-sdk"
import { createLinkStep } from "../../common"

type WorkflowInput = {
  authIdentityId: string
  customersData: CreateCustomerDTO
}

export const createCustomerAccountWorkflowId = "create-customer-account"
export const createCustomerAccountWorkflow = createWorkflow(
  createCustomerAccountWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO> => {
    const customers = createCustomersStep([input.customersData])

    const customer = transform(
      customers,
      (customers: CustomerDTO[]) => customers[0]
    )

    const link = transform(
      { customer, authIdentityId: input.authIdentityId },
      (data) => {
        return [
          {
            [Modules.CUSTOMER]: { customer_id: data.customer.id },
            [Modules.AUTH]: { auth_identity_id: data.authIdentityId },
          },
        ]
      }
    )

    createLinkStep(link)
    return customer
  }
)
