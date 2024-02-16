import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICustomerModuleService } from "@medusajs/types"
import { validateEmail } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface StepInput {
  customerId?: string
  email?: string
}

export interface StepOutput {
  customer?: any
  email?: string
}

export const findOrCreateCustomerStepId = "find-or-create-customer"
export const findOrCreateCustomerStep = createStep(
  findOrCreateCustomerStepId,
  async (data: StepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const customerData: StepOutput = {}

    if (data.customerId) {
      const customer = await service.retrieve(data.customerId)
      customerData.customer = customer
      customerData.email = customer.email

      return new StepResponse(customerData)
    }

    if (data.email) {
      const validatedEmail = validateEmail(data.email)

      let [customer] = await service.list({
        email: validatedEmail,
        has_account: false,
      })

      if (!customer) {
        customer = await service.create({ email: validatedEmail })
      }

      customerData.customer = customer
      customerData.email = customer.email
    }

    return new StepResponse(customerData)
  }
)
