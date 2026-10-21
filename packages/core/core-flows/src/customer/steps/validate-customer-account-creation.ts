import type { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { CreateCustomerAccountWorkflowInput } from "../workflows"

export const validateCustomerAccountCreationStepId =
  "validate-customer-account-creation"

/**
 * This step validates the input data for creating a customer account.
 * The step throws an error if:
 * 
 * - The email is missing
 * - An auth identity is provided, and the email doesn't match the auth identity's email.
 *   The auth identity's email is the `entity_id` of its `emailpass` provider identity, or the
 *   `user_metadata.email` of any of its provider identities (for example, Google or GitHub).
 *   The comparison ignores case and surrounding whitespace. If the auth identity has no email,
 *   the step also throws an error.
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

    if (input.authIdentityId) {
      const authService = container.resolve<IAuthModuleService>(Modules.AUTH)
      const authIdentity = await authService.retrieveAuthIdentity(
        input.authIdentityId,
        { relations: ["provider_identities"] }
      )

      const normalize = (value: unknown) =>
        typeof value === "string" ? value.trim().toLowerCase() : undefined

      const identityEmails = (authIdentity.provider_identities ?? [])
        .flatMap((providerIdentity) => [
          providerIdentity.provider === "emailpass"
            ? normalize(providerIdentity.entity_id)
            : undefined,
          normalize(providerIdentity.user_metadata?.email),
        ])
        .filter(Boolean)

      if (!identityEmails.includes(normalize(email))) {
        throw new MedusaError(
          MedusaError.Types.UNAUTHORIZED,
          "The customer's email must match the email of the authenticated identity"
        )
      }
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
