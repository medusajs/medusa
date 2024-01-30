import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { createCustomerStep } from "../../handlers/customer"

type WorkflowInput = { customersData: CreateCustomerDTO[] }

export const createCustomersWorkflowId = "create-customers"
export const createCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO[]> => {
    return createCustomerStep(input.customersData)
  }
)
