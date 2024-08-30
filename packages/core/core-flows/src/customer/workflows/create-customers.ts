import { AdditionalData, CreateCustomerDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCustomersStep } from "../steps"

export type CreateCustomersWorkflowInput = {
  customersData: CreateCustomerDTO[]
} & AdditionalData

export const createCustomersWorkflowId = "create-customers"
/**
 * This workflow creates one or more customers.
 */
export const createCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<CreateCustomersWorkflowInput>) => {
    const createdCustomers = createCustomersStep(input.customersData)
    const customersCreated = createHook("customersCreated", {
      customers: createdCustomers,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdCustomers, {
      hooks: [customersCreated],
    })
  }
)
