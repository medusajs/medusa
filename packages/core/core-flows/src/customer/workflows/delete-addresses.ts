import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteCustomerAddressesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCustomerAddressesWorkflowId = "delete-customer-addresses"
export const deleteCustomerAddressesWorkflow = createWorkflow(
  deleteCustomerAddressesWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedAddresses = deleteCustomerAddressesStep(input.ids)
    const addressesDeleted = createHook("addressesDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedAddresses, {
      hooks: [addressesDeleted],
    })
  }
)
