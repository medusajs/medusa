import { MedusaError, Modules } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import { CreateCustomerAccountWorkflowInput } from "../workflows"

export const validateCustomerAccountCreationStepId =
  "validate-customer-account-creation"

/**
 * This step validates the input data for creating a customer account.
 * The step throws an error if:
 * 
 * - The email is missing
 * - A customer with the email already exists and has an account
 * - A guest customer with the email already exists
 * 
 * @example
 * const data = validateCustomerAccountCreation({
 *   authIdentityId: "au_1234",
 *   customerData: {
 *     first_name: "John",
 *     last_name: "Doe",
 *     email: "john.doe@example.com",
 *   }
 * })
 */
export const validateCustomerAccountCreation = createStep(
  validateCustomerAccountCreationStepId,
  async (input: CreateCustomerAccountWorkflowInput, { container }) => {
    const customerService = container.resolve(Modules.CUSTOMER)

    const { email } = input.customerData

    if (!email) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Email is required to create a customer"
      )
    }

    // Check if customer with email already exists
    const existingCustomers = await customerService.listCustomers({ email })

    if (existingCustomers?.length) {
      const hasExistingAccount = existingCustomers.some(
        (customer) => customer.has_account
      )

      if (hasExistingAccount && input.authIdentityId) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "Customer with this email already has an account"
        )
      }

      if (!hasExistingAccount && !input.authIdentityId) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "Guest customer with this email already exists"
        )
      }
    }
  }
)
