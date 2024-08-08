import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteCustomersStepId = "delete-customers"
/**
 * This step deletes one or more customers.
 */
export const deleteCustomersStep = createStep(
  deleteCustomersStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.softDeleteCustomers(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerIds, { container }) => {
    if (!prevCustomerIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.restoreCustomers(prevCustomerIds)
  }
)
