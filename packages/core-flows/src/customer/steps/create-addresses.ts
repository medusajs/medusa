import {
  ICustomerModuleService,
  CreateCustomerAddressDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createCustomerAddressesStepId = "create-customer-addresses"
export const createCustomerAddressesStep = createStep(
  createCustomerAddressesStepId,
  async (data: CreateCustomerAddressDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    try {
      const addresses = await service.addAddresses(data)

      return new StepResponse(
        addresses,
        addresses.map((address) => address.id)
      )
    } catch (error) {
      console.log("things went wrong")
      console.log(error)
      console.log(error.message)
      console.log(error.stack)
      console.log(error.code)
      console.log(error.constraint)
      console.log(Object.keys(error))
      throw error
    }
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.deleteAddress(ids)
  }
)
