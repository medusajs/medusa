import { CustomerDTO, ICustomerModuleService } from "@medusajs/framework/types"
import { Modules, validateEmail } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface FindOrCreateCustomerStepInput {
  customerId?: string | null
  email?: string | null
}

export interface FindOrCreateCustomerOutputStepOutput {
  customer?: CustomerDTO | null
  email?: string | null
}

interface StepCompensateInput {
  customer?: CustomerDTO
  customerWasCreated: boolean
}

export const findOrCreateCustomerStepId = "find-or-create-customer"
/**
 * This step either finds a customer matching the specified ID, or finds / create a customer
 * matching the specified email. If both ID and email are provided, ID takes precedence.
 */
export const findOrCreateCustomerStep = createStep(
  findOrCreateCustomerStepId,
  async (data: FindOrCreateCustomerStepInput, { container }) => {
    if (
      typeof data.customerId === undefined &&
      typeof data.email === undefined
    ) {
      return new StepResponse(
        {
          customer: undefined,
          email: undefined,
        },
        { customerWasCreated: false }
      )
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const customerData: FindOrCreateCustomerOutputStepOutput = {
      customer: null,
      email: null,
    }
    let customerWasCreated = false

    if (data.customerId) {
      const customer = await service.retrieveCustomer(data.customerId)
      customerData.customer = customer
      customerData.email = customer.email

      return new StepResponse(customerData, {
        customerWasCreated,
      })
    }

    if (data.email) {
      const validatedEmail = validateEmail(data.email)

      let [customer] = await service.listCustomers({
        email: validatedEmail,
        has_account: false,
      })

      if (!customer) {
        customer = await service.createCustomers({ email: validatedEmail })
        customerWasCreated = true
      }

      customerData.customer = customer
      customerData.email = customer.email
    }

    return new StepResponse(customerData, {
      customer: customerData.customer,
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
