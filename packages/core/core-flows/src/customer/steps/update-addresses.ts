import {
  FilterableCustomerAddressProps,
  ICustomerModuleService,
  UpdateCustomerAddressDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type UpdateCustomerAddresseStepInput = {
  selector: FilterableCustomerAddressProps
  update: UpdateCustomerAddressDTO
}

export const updateCustomerAddresseStepId = "update-customer-addresses"
/**
 * This step updates one or more customer addresses.
 */
export const updateCustomerAddressesStep = createStep(
  updateCustomerAddresseStepId,
  async (data: UpdateCustomerAddresseStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.listCustomerAddresses(data.selector, {
      select: selects,
      relations,
    })

    const customerAddresses = await service.updateCustomerAddresses(
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
      prevCustomerAddresses.map((c) =>
        service.updateCustomerAddresses(c.id, { ...c })
      )
    )
  }
)
