import { AdditionalData, CreateCustomerDTO } from "@medusajs/framework/types"
import { CustomerWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
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

    const customerIdEvents = transform(
      { createdCustomers },
      ({ createdCustomers }) => {
        return createdCustomers.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: CustomerWorkflowEvents.CREATED,
      data: customerIdEvents,
    })

    return new WorkflowResponse(createdCustomers, {
      hooks: [customersCreated],
    })
  }
)
