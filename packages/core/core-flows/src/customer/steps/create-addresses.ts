import {
  CreateCustomerAddressDTO,
  ICustomerModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create one or more customer addresses.
 */
export type CreateCustomerAddressesStepInput = CreateCustomerAddressDTO[]

export const createCustomerAddressesStepId = "create-customer-addresses"
/**
 * This step creates one or more customer addresses.
 * 
 * @example
 * const data = createCustomerAddressesStep([
 *   {
 *     customer_id: "cus_123",
 *     first_name: "John",
 *     last_name: "Doe",
 *     address_1: "123 Main St",
 *     city: "Anytown",
 *     province: "NY",
 *     postal_code: "12345",
 *     country_code: "us",
 *   }
 * ])
 */
export const createCustomerAddressesStep = createStep(
  createCustomerAddressesStepId,
  async (data: CreateCustomerAddressesStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const addresses = await service.createCustomerAddresses(data)

    return new StepResponse(
      addresses,
      addresses.map((address) => address.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.deleteCustomerAddresses(ids)
  }
)
