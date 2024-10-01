import {
  AdditionalData,
  CustomerUpdatableFields,
  FilterableCustomerProps,
} from "@medusajs/framework/types"
import { CustomerWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateCustomersStep } from "../steps"

export type UpdateCustomersWorkflowInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdatableFields
} & AdditionalData

export const updateCustomersWorkflowId = "update-customers"
/**
 * This workflow updates one or more customers.
 */
export const updateCustomersWorkflow = createWorkflow(
  updateCustomersWorkflowId,
  (input: WorkflowData<UpdateCustomersWorkflowInput>) => {
    const updatedCustomers = updateCustomersStep(input)
    const customersUpdated = createHook("customersUpdated", {
      customers: updatedCustomers,
      additional_data: input.additional_data,
    })

    const customerIdEvents = transform(
      { updatedCustomers },
      ({ updatedCustomers }) => {
        const arr = Array.isArray(updatedCustomers)
          ? updatedCustomers
          : [updatedCustomers]

        return arr?.map((customer) => {
          return { id: customer.id }
        })
      }
    )

    emitEventStep({
      eventName: CustomerWorkflowEvents.UPDATED,
      data: customerIdEvents,
    })

    return new WorkflowResponse(updatedCustomers, {
      hooks: [customersUpdated],
    })
  }
)
