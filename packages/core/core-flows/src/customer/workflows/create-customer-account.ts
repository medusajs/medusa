import type { CreateCustomerDTO, CustomerDTO } from "@medusajs/framework/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { validateCustomerAccountCreation } from "../steps/validate-customer-account-creation"
import { createCustomersWorkflow } from "./create-customers"

/**
 * The details of the customer account to create.
 */
export type CreateCustomerAccountWorkflowInput = {
  /**
   * The ID of the auth identity to attach the customer to.
   */
  authIdentityId: string
  /**
   * The details of the customer to create.
   */
  customerData: CreateCustomerDTO
}

export const createCustomerAccountWorkflowId = "create-customer-account"
/**
 * This workflow creates a customer and attaches it to an auth identity. It's used by the
 * [Register Customer Store API Route](https://docs.medusajs.com/api/store/customers/register-customer).
 *
 * You can create an auth identity first using the [Retrieve Registration JWT Token API Route](https://docs.medusajs.com/api/store/auth/retrieve-registration-jwt-token).
 * Learn more about basic authentication flows in [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * register or create customer accounts within your custom flows.
 *
 * @example
 * const { result } = await createCustomerAccountWorkflow(container)
 * .run({
 *   input: {
 *     authIdentityId: "au_1234",
 *     customerData: {
 *       first_name: "John",
 *       last_name: "Doe",
 *       email: "john.doe@example.com",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create or register a customer account.
 */
export const createCustomerAccountWorkflow = createWorkflow(
  createCustomerAccountWorkflowId,
  (
    input: WorkflowData<CreateCustomerAccountWorkflowInput>
  ): WorkflowResponse<CustomerDTO> => {
    validateCustomerAccountCreation(input)

    const customerData = transform({ input }, (data) => {
      return {
        ...data.input.customerData,
        has_account: !!data.input.authIdentityId,
      }
    })

    const customers = createCustomersWorkflow.runAsStep({
      input: {
        customersData: [customerData],
      },
    })

    const customer = transform(
      customers,
      (customers: CustomerDTO[]) => customers[0]
    )

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "customer",
      value: customer.id,
    })

    return new WorkflowResponse(customer)
  }
)
