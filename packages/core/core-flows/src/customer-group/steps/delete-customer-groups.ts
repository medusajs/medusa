import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type DeleteCustomerGroupStepInput = string[]

export const deleteCustomerGroupStepId = "delete-customer-groups"
export const deleteCustomerGroupStep = createStep(
  deleteCustomerGroupStepId,
  async (ids: DeleteCustomerGroupStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.softDeleteCustomerGroups(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.restoreCustomerGroups(prevCustomerGroups)
  }
)
