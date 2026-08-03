import type {
  CustomerDTO,
  ICustomerModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"
import {
  isDefined,
  Modules,
  useCache,
  validateEmail,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the customer to find or create.
 */
export interface FindOrCreateCustomerStepInput {
  /**
   * The ID of the customer to find.
   */
  customerId?: string | null
  /**
   * If the `customerId` isn't specified,
   * find a customer with this email or create a new customer having this email.
   */
  email?: string | null
}

/**
 * The details of the customer found or created.
 */
export interface FindOrCreateCustomerOutputStepOutput {
  /**
   * The customer found or created, if any.
   */
  customer?: CustomerDTO | null
  /**
   * The email of the customer found or created, if any.
   */
  email?: string | null
}

interface StepCompensateInput {
  customer?: CustomerDTO
  customerWasCreated: boolean
}

async function fetchCustomerById(
  customerId: string,
  container: MedusaContainer
): Promise<CustomerDTO> {
  const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

  return await useCache<CustomerDTO>(
    async () =>
      service.retrieveCustomer(customerId, { relations: ["groups"] }),
    {
      container,
      key: ["find-or-create-customer-by-id", customerId],
    }
  )
}

async function fetchCustomersByEmail(
  email: string,
  container: MedusaContainer,
  hasAccount?: boolean
): Promise<CustomerDTO[]> {
  const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

  const filters =
    hasAccount !== undefined ? { email, has_account: hasAccount } : { email }

  return await useCache<CustomerDTO[]>(
    async () => service.listCustomers(filters, { relations: ["groups"] }),
    {
      container,
      key: ["find-or-create-customer-by-email", filters],
    }
  )
}

export const findOrCreateCustomerStepId = "find-or-create-customer"
/**
 * This step finds or creates a customer based on the provided ID or email. It prioritizes finding the customer by ID, then by email.
 *
 * The step creates a new customer either if:
 *
 * - No customer is found with the provided ID and email;
 * - Or if it found the customer by ID but their email does not match the email in the input.
 *
 * The step returns the details of the customer found or created, along with their email.
 */
export const findOrCreateCustomerStep = createStep(
  findOrCreateCustomerStepId,
  async (data: FindOrCreateCustomerStepInput, { container }) => {
    if (!isDefined(data.customerId) && !isDefined(data.email)) {
      return new StepResponse(
        {
          customer: undefined,
          email: undefined,
        },
        {
          customerWasCreated: false,
        }
      )
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const customerData: FindOrCreateCustomerOutputStepOutput = {
      customer: null,
      email: null,
    }
    let originalCustomer: CustomerDTO | null = null
    let customerWasCreated = false

    if (data.customerId) {
      originalCustomer = await fetchCustomerById(data.customerId, container)
      customerData.customer = originalCustomer
      customerData.email = originalCustomer.email
    }

    if (data.email) {
      const validatedEmail = (data.email && validateEmail(data.email)) as string

      let [customer] = originalCustomer
        ? [originalCustomer]
        : await fetchCustomersByEmail(validatedEmail, container)

      // if NOT a guest customer, return it
      if (customer?.has_account) {
        customerData.customer = customer
        customerData.email = customer.email

        return new StepResponse(customerData, {
          customerWasCreated,
        })
      }

      if (customer && customer.email !== validatedEmail) {
        ;[customer] = await fetchCustomersByEmail(
          validatedEmail,
          container,
          false
        )
      }

      if (!customer) {
        customer = await service.createCustomers({ email: validatedEmail })
        customerWasCreated = true
      }

      originalCustomer = customer

      customerData.customer = customer
      customerData.email = customer.email
    }

    return new StepResponse(customerData, {
      customer: originalCustomer,
      customerWasCreated,
    })
  },
  async (compData, { container }) => {
    const { customer, customerWasCreated } = compData as StepCompensateInput

    if (!customerWasCreated || !customer?.id) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.deleteCustomers(customer.id)
  }
)
