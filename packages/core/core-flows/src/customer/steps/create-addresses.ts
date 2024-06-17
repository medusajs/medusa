import {
  CreateCustomerAddressDTO,
  ICustomerModuleService,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createCustomerAddressesStepId = "create-customer-addresses"
export const createCustomerAddressesStep = createStep(
  createCustomerAddressesStepId,
  async (data: CreateCustomerAddressDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const addresses = await service.addAddresses(data)

    return new StepResponse(
      addresses,
      addresses.map((address) => address.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.deleteAddresses(ids)
  }
)
