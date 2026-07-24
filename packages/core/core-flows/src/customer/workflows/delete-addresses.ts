import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteCustomerAddressesStep } from "../steps"

/**
 * The details of the addresses to delete.
 */
export type DeleteCustomerAddressesWorkflowInput = { 
  /**
   * The IDs of the addresses to delete.
   */
  ids: string[]
}

export const deleteCustomerAddressesWorkflowId = "delete-customer-addresses"
/**
 * This workflow deletes one or more customer addresses. It's used by the
 * [Remove Customer Addresses Admin API Route](https://docs.medusajs.com/api/admin/customers/remove-an-address-from-customer)
 * and the [Remove Customer Addresses Store API Route](https://docs.medusajs.com/api/store/customers/remove-address).
 * 
 * :::note
 * 
 * This workflow deletes addresses created by the [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer)
 * only. So, you can't delete addresses attached to a cart, for example. To do that, use the workflow
 * relevant to that module.
 * 
 * :::
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to 
 * delete customer addresses in your custom flows.
 * 
 * @example
 * const { result } = await deleteCustomerAddressesWorkflow(container)
 * .run({
 *   input: {
 *     ids: [
 *       "cuaddress_123"
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more customer addresses.
 * 
 * @property hooks.addressesDeleted - This hook is executed after the addresses are deleted. You can consume this hook to perform custom actions.
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
