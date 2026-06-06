import type {
  IInventoryService,
  InventoryTypes,
} from "@zjedene-medusa/framework/types"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to create the inventory levels.
 */
export type CreateInventoryLevelsStepInput =
  InventoryTypes.CreateInventoryLevelInput[]

export const createInventoryLevelsStepId = "create-inventory-levels"
/**
 * This step creates one or more inventory levels.
 */
export const createInventoryLevelsStep = createStep(
  createInventoryLevelsStepId,
  async (data: CreateInventoryLevelsStepInput, { container }) => {
    const service = container.resolve<IInventoryService>(Modules.INVENTORY)
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

    const service = container.resolve<IInventoryService>(Modules.INVENTORY)

    await service.deleteInventoryLevels(ids)
  }
)
