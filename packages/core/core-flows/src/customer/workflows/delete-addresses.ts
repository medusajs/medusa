import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteCustomerAddressesStep } from "../steps"

export type DeleteCustomerAddressesWorkflowInput = { ids: string[] }

export const deleteCustomerAddressesWorkflowId = "delete-customer-addresses"
/**
 * This workflow deletes one or more customer addresses.
 */
export const deleteCustomerAddressesWorkflow = createWorkflow(
  deleteCustomerAddressesWorkflowId,
  (input: WorkflowData<DeleteCustomerAddressesWorkflowInput>) => {
    const deletedAddresses = deleteCustomerAddressesStep(input.ids)
    const addressesDeleted = createHook("addressesDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedAddresses, {
      hooks: [addressesDeleted],
    })
  }
)
