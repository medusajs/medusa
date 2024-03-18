import { ICustomerModuleService, IInventoryServiceNext } from "@medusajs/types"
import { StepResponse, WorkflowData, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const deleteInventoryLevelsStepId = "delete-customers"
export const deleteLevelsStep = createStep(
  deleteInventoryLevelsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.softDeleteInventoryLevels(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevLevelIds, { container }) => {
    if (!prevLevelIds?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.restoreInventoryLevels(prevLevelIds)
  }
)
