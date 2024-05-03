import { CustomerGroupDTO, CreateCustomerGroupDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCustomerGroupsStep } from "../steps"

type WorkflowInput = { customersData: CreateCustomerGroupDTO[] }

export const createCustomerGroupsWorkflowId = "create-customer-groups"
export const createCustomerGroupsWorkflow = createWorkflow(
  createCustomerGroupsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CustomerGroupDTO[]> => {
    return createCustomerGroupsStep(input.customersData)
  }
)
