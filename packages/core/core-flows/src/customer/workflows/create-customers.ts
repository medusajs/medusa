import { CustomerDTO, CreateCustomerDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCustomersStep } from "../steps"

type WorkflowInput = { customersData: CreateCustomerDTO[] }

export const createCustomersWorkflowId = "create-customers"
export const createCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<CustomerDTO[]>> => {
    return new WorkflowResponse(createCustomersStep(input.customersData))
  }
)
