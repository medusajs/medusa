import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { createCustomersStep } from "../steps"
import { setAuthAppMetadataStep } from "../../auth/steps"
import { transform } from "@medusajs/workflows-sdk"

type WorkflowInput = {
  authUserId: string
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

    setAuthAppMetadataStep({
      authUserId: input.authUserId,
      key: "customer_id",
      value: customer.id,
    })

    return customer
  }
)
