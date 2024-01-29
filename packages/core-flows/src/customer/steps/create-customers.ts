import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { CreateCustomerDTO, ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createCustomersStepId = "create-customers"
export const createCustomersStep = createStep(
  createCustomersStepId,
  async (data: CreateCustomerDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const createdCustomers = await service.create(data)

    return new StepResponse(
      createdCustomers,
      createdCustomers.map((createdCustomers) => createdCustomers.id)
    )
  },
  async (createdCustomerIds, { container }) => {
    if (!createdCustomerIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.delete(createdCustomerIds)
  }
)
