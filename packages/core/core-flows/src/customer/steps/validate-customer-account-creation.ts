import type {
  AuthIdentityDTO,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { isString, MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateCustomerAccountWorkflowInput } from "../workflows"

/**
 * The validated data of the customer account to create.
 */
export type ValidateCustomerAccountCreationStepOutput = {
  /**
   * The email to create the customer with.
   */
  email: string
}

const getAuthIdentityEmails = (authIdentity: AuthIdentityDTO): string[] => {
  const emails: string[] = []

  for (const providerIdentity of authIdentity.provider_identities ?? []) {
    if (providerIdentity.provider === "emailpass") {
      emails.push(providerIdentity.entity_id)
    }

    const metadataEmail = providerIdentity.user_metadata?.email
    if (isString(metadataEmail) && metadataEmail) {
      emails.push(metadataEmail)
    }
  }

  return emails
}

export const validateCustomerAccountCreationStepId =
  "validate-customer-account-creation"

/**
 * This step validates the input data for creating a customer account.
 * The step throws an error if:
 * 
 * - The email is missing
 * - The email doesn't match the email of the auth identity, if the auth identity has one
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

    let { email } = input.customerData

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

      const authIdentityEmails = getAuthIdentityEmails(authIdentity)

      if (authIdentityEmails.length) {
        const matchingEmail = authIdentityEmails.find(
          (authIdentityEmail) =>
            authIdentityEmail.toLowerCase() === email!.toLowerCase()
        )

        if (!matchingEmail) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "The email of the customer must match the email of the authenticated identity"
          )
        }

        email = matchingEmail
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

    return new StepResponse<ValidateCustomerAccountCreationStepOutput>({
      email,
    })
  }
)
