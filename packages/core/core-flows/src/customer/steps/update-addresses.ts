import {
  FilterableCustomerAddressProps,
  ICustomerModuleService,
  UpdateCustomerAddressDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update one or more customer addresses.
 */
export type UpdateCustomerAddresseStepInput = {
  /**
   * The filters to select the customer addresses to update.
   */
  selector: FilterableCustomerAddressProps
  /**
   * The data to update the customer addresses with.
   */
  update: UpdateCustomerAddressDTO
}

export const updateCustomerAddresseStepId = "update-customer-addresses"
/**
 * This step updates one or more customer addresses.
 * 
 * @example
 * const data = updateCustomerAddressesStep({
 *   selector: {
 *     customer_id: "cus_123"
 *   },
 *   update: {
 *     country_code: "us"
 *   }
 * })
 */
export const updateCustomerAddressesStep = createStep(
  updateCustomerAddresseStepId,
  async (data: UpdateCustomerAddresseStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

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

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await promiseAll(
      prevCustomerAddresses.map((c) =>
        service.updateCustomerAddresses(c.id, { ...c })
      )
    )
  }
)
