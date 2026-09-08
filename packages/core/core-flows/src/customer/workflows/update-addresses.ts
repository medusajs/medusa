import {
  FilterableCustomerAddressProps,
  UpdateCustomerAddressDTO,
  AdditionalData,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
  updateCustomerAddressesStep,
} from "../steps"

/**
 * The data to update one or more customer addresses, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateCustomerAddressesWorkflowInput = {
  /**
   * The filters to select the addresses to update.
   */
  selector: FilterableCustomerAddressProps
  /**
   * The data to update in the addresses.
   */
  update: UpdateCustomerAddressDTO
} & AdditionalData

export const updateCustomerAddressesWorkflowId = "update-customer-addresses"
/**
 * This workflow updates one or more addresses for customers. It's used by the [Update Customer Address Admin API Route](https://docs.medusajs.com/api/admin/customers/update-address)
 * and the [Update Customer Address Store API Route](https://docs.medusajs.com/api/store/customers/update-address).
 * 
 * This workflow has a hook that allows you to perform custom actions on the updated customer addresses. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the addresses.
 * 
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around updating customer addresses.
 * 
 * @example
 * const { result } = await updateCustomerAddressesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       customer_id: "123"
 *     },
 *     update: {
 *       first_name: "John"
 *     },
 *     additional_data: {
 *       crm_id: "123"
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Update one or more customer addresses.
 * 
 * @property hooks.addressesUpdated - This hook is executed after the addresses are updated. You can consume this hook to perform custom actions on the updated addresses.
 */
export const updateCustomerAddressesWorkflow = createWorkflow(
  updateCustomerAddressesWorkflowId,
  (input: WorkflowData<UpdateCustomerAddressesWorkflowInput>) => {
    const unsetInput = transform(input, (data) => ({
      update: data,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    const updatedAddresses = updateCustomerAddressesStep(input)
    const addressesUpdated = createHook("addressesUpdated", {
      addresses: updatedAddresses,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedAddresses, {
      hooks: [addressesUpdated],
    })
  }
)
