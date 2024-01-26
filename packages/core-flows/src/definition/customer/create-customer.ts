import { CreateCustomerDTO, CustomerDTO } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { createStoreCustomerStep } from "../../handlers/customer"

type WorkflowInput = { customersData: CreateCustomerDTO[] }

export const createStoreCustomersWorkflowId = "create-store-customers"
export const createStoreCustomersWorkflow = createWorkflow(
  createStoreCustomersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerDTO[]> => {
    return createStoreCustomerStep(input.customersData)
  }
)
