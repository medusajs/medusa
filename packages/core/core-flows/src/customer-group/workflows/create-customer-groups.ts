import {
  CustomerGroupDTO,
  CreateCustomerGroupDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createCustomerGroupsStep } from "../steps"

export type CreateCustomerGroupsWorkflowInput = {
  customersData: CreateCustomerGroupDTO[]
}

export const createCustomerGroupsWorkflowId = "create-customer-groups"
/**
 * This workflow creates one or more customer groups.
 */
export const createCustomerGroupsWorkflow = createWorkflow(
  createCustomerGroupsWorkflowId,
  (
    input: WorkflowData<CreateCustomerGroupsWorkflowInput>
  ): WorkflowResponse<CustomerGroupDTO[]> => {
    return new WorkflowResponse(createCustomerGroupsStep(input.customersData))
  }
)
