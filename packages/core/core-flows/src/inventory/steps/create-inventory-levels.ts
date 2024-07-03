import { IInventoryService, InventoryTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

export const createInventoryLevelsStepId = "create-inventory-levels"
export const createInventoryLevelsStep = createStep(
  createInventoryLevelsStepId,
  async (data: InventoryTypes.CreateInventoryLevelInput[], { container }) => {
    const service = container.resolve<IInventoryService>(
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

    const service = container.resolve<IInventoryService>(
      ModuleRegistrationName.INVENTORY
    )

    await service.deleteInventoryLevels(ids)
  }
)
