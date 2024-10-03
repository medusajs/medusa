import { CustomerWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteCustomersStep } from "../steps"

export type DeleteCustomersWorkflowInput = { ids: string[] }

export const deleteCustomersWorkflowId = "delete-customers"
/**
 * This workflow deletes one or more customers.
 */
export const deleteCustomersWorkflow = createWorkflow(
  deleteCustomersWorkflowId,
  (input: WorkflowData<DeleteCustomersWorkflowInput>) => {
    const deletedCustomers = deleteCustomersStep(input.ids)
    const customersDeleted = createHook("customersDeleted", {
      ids: input.ids,
    })

    const customerIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: CustomerWorkflowEvents.DELETED,
      data: customerIdEvents,
    })

    return new WorkflowResponse(deletedCustomers, {
      hooks: [customersDeleted],
    })
  }
)
