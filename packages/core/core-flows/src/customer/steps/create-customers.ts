import {
  CreateCustomerDTO,
  ICustomerModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create one or more customers.
 */
export type CreateCustomersStepInput = CreateCustomerDTO[]

export const createCustomersStepId = "create-customers"
/**
 * This step creates one or more customers.
 * 
 * @example
 * const data = createCustomersStep([
 *   {
 *     first_name: "John",
 *     last_name: "Doe",
 *     email: "customer@example.com",
 *   }
 * ])
 */
export const createCustomersStep = createStep(
  createCustomersStepId,
  async (data: CreateCustomersStepInput, { container }) => {
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
