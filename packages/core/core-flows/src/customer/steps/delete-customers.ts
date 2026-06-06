import type { ICustomerModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the customers to delete.
 */
export type DeleteCustomersStepInput = string[]

export const deleteCustomersStepId = "delete-customers"
/**
 * This step deletes one or more customers.
 */
export const deleteCustomersStep = createStep(
  deleteCustomersStepId,
  async (ids: DeleteCustomersStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.softDeleteCustomers(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerIds, { container }) => {
    if (!prevCustomerIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.restoreCustomers(prevCustomerIds)
  }
)
