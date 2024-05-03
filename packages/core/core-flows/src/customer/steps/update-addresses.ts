import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  UpdateCustomerAddressDTO,
  FilterableCustomerAddressProps,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type UpdateCustomerAddresseStepInput = {
  selector: FilterableCustomerAddressProps
  update: UpdateCustomerAddressDTO
}

export const updateCustomerAddresseStepId = "update-customer-addresses"
export const updateCustomerAddressesStep = createStep(
  updateCustomerAddresseStepId,
  async (data: UpdateCustomerAddresseStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.listAddresses(data.selector, {
      select: selects,
      relations,
    })

    const customerAddresses = await service.updateAddresses(
      data.selector,
      data.update
    )

    return new StepResponse(customerAddresses, prevCustomers)
  },
  async (prevCustomerAddresses, { container }) => {
    if (!prevCustomerAddresses) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomerAddresses.map((c) => service.updateAddresses(c.id, { ...c }))
    )
  }
)
