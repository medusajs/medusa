import { IInventoryServiceNext, InventoryNext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createInventoryLevelsStepId = "create-inventory-levels"
export const createInventoryLevelsStep = createStep(
  createInventoryLevelsStepId,
  async (data: InventoryNext.CreateInventoryLevelInput[], { container }) => {
    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    const inventoryLevels = await service.createInventoryLevels(data)
    return new StepResponse(
      inventoryLevels,
      inventoryLevels.map((level) => level.id)
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const service = container.resolve<IInventoryServiceNext>(
      ModuleRegistrationName.INVENTORY
    )

    await service.deleteInventoryLevels(ids)
  }
)
