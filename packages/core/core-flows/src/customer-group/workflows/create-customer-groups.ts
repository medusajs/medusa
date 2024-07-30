import { CustomerGroupDTO, CreateCustomerGroupDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCustomerGroupsStep } from "../steps"

type WorkflowInput = { customersData: CreateCustomerGroupDTO[] }

export const createCustomerGroupsWorkflowId = "create-customer-groups"
export const createCustomerGroupsWorkflow = createWorkflow(
  createCustomerGroupsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<CustomerGroupDTO[]>> => {
    return new WorkflowResponse(createCustomerGroupsStep(input.customersData))
  }
)
