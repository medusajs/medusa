import { CreateCustomerDTO, ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createCustomersStepId = "create-customers"
/**
 * This step creates one or more customers.
 */
export const createCustomersStep = createStep(
  createCustomersStepId,
  async (data: CreateCustomerDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const createdCustomers = await service.createCustomers(data)

    return new StepResponse(
      createdCustomers,
      createdCustomers.map((createdCustomers) => createdCustomers.id)
    )
  },
  async (createdCustomerIds, { container }) => {
    if (!createdCustomerIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.deleteCustomers(createdCustomerIds)
  }
)
