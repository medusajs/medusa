import {
  AdditionalData,
  CreateCustomerAddressDTO,
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
  createCustomerAddressesStep,
  maybeUnsetDefaultBillingAddressesStep,
  maybeUnsetDefaultShippingAddressesStep,
} from "../steps"

/**
 * The data to create one or more customer addresses, along with custom data that's passed to the workflow's hooks.
 */
export type CreateCustomerAddressesWorkflowInput = {
  /**
   * The addresses to create.
   */
  addresses: CreateCustomerAddressDTO[]
} & AdditionalData

export const createCustomerAddressesWorkflowId = "create-customer-addresses"
/**
 * This workflow creates one or more addresses for customers. It's used by the [Add Customer Address Admin API Route](https://docs.medusajs.com/api/admin/customers/add-address)
 * and the [Add Customer Address Store API Route](https://docs.medusajs.com/api/store/customers/create-address).
 * 
 * This workflow has a hook that allows you to perform custom actions on the created customer addresses. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the addresses.
 * 
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around creating customer addresses.
 * 
 * @example
 * const { result } = await createCustomerAddressesWorkflow(container)
 * .run({
 *   input: {
 *     addresses: [
 *       {
 *         customer_id: "cus_123",
 *         address_1: "456 Elm St",
 *         city: "Los Angeles",
 *         country_code: "us",
 *         postal_code: "90001",
 *         first_name: "Jane",
 *         last_name: "Smith",
 *       },
 *       {
 *         customer_id: "cus_321",
 *         address_1: "789 Oak St",
 *         city: "New York",
 *         country_code: "us",
 *         postal_code: "10001",
 *         first_name: "Alice",
 *         last_name: "Johnson",
 *       }
 *     ],
 *     additional_data: {
 *       crm_id: "123"
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Create one or more customer addresses.
 * 
 * @property hooks.addressesCreated - This hook is executed after the addresses are created. You can consume this hook to perform custom actions on the created addresses.
 */
export const createCustomerAddressesWorkflow = createWorkflow(
  createCustomerAddressesWorkflowId,
  (input: WorkflowData<CreateCustomerAddressesWorkflowInput>) => {
    const unsetInput = transform(input, (data) => ({
      create: data.addresses,
    }))

    parallelize(
      maybeUnsetDefaultShippingAddressesStep(unsetInput),
      maybeUnsetDefaultBillingAddressesStep(unsetInput)
    )

    const createdAddresses = createCustomerAddressesStep(input.addresses)
    const addressesCreated = createHook("addressesCreated", {
      addresses: createdAddresses,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdAddresses, {
      hooks: [addressesCreated],
    })
  }
)
