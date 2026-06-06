import type { ICustomerModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the customer groups to delete.
 */
export type DeleteCustomerGroupsStepInput = string[]

export const deleteCustomerGroupStepId = "delete-customer-groups"
/**
 * This step deletes one or more customer groups.
 */
export const deleteCustomerGroupStep = createStep(
  deleteCustomerGroupStepId,
  async (ids: DeleteCustomerGroupsStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.softDeleteCustomerGroups(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.restoreCustomerGroups(prevCustomerGroups)
  }
)
