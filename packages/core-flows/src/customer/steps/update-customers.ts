import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableCustomerProps,
  ICustomerModuleService,
  CustomerUpdatableFields,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type UpdateCustomersStepInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdatableFields
}

export const updateCustomersStepId = "update-customer"
export const updateCustomersStep = createStep(
  updateCustomersStepId,
  async (data: UpdateCustomersStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomers = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.update(data.selector, data.update)

    return new StepResponse(customers, prevCustomers)
  },
  async (prevCustomers, { container }) => {
    if (!prevCustomers?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomers.map((c) =>
        service.update(c.id, {
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
