import {
  CustomerUpdatableFields,
  FilterableCustomerProps,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

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

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

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
