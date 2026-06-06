import {
  CustomerUpdatableFields,
  FilterableCustomerProps,
  ICustomerModuleService,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update one or more customers.
 */
export type UpdateCustomersStepInput = {
  /**
   * The filters to select the customers to update.
   */
  selector: FilterableCustomerProps
  /**
   * The data to update the customers with.
   */
  update: CustomerUpdatableFields
}

export const updateCustomersStepId = "update-customer"
/**
 * This step updates one or more customers.
 * 
 * @example
 * const data = updateCustomersStep({
 *   selector: {
 *     id: "cus_123"
 *   },
 *   update: {
 *     last_name: "Doe"
 *   }
 * })
 */
export const updateCustomersStep = createStep(
  updateCustomersStepId,
  async (data: UpdateCustomersStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.listCustomers(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.updateCustomers(data.selector, data.update)

    return new StepResponse(customers, prevCustomers)
  },
  async (prevCustomers, { container }) => {
    if (!prevCustomers?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await promiseAll(
      prevCustomers.map((c) =>
        service.updateCustomers(c.id, {
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone,
          metadata: c.metadata,
        })
      )
    )
  }
)
