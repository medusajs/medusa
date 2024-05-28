import { IInventoryServiceNext, InventoryNext } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const adjustInventoryLevelsStepId = "adjust-inventory-levels-step"
export const adjustInventoryLevelsStep = createStep(
  adjustInventoryLevelsStepId,
  async (
    input: InventoryNext.BulkAdjustInventoryLevelInput[],
    { container }
  ) => {
    const inventoryService: IInventoryServiceNext = container.resolve(
      ModuleRegistrationName.INVENTORY
    )

    const adjustedLevels: InventoryNext.InventoryLevelDTO[] =
      await inventoryService.adjustInventory(
        input.map((item) => {
          return {
            inventoryItemId: item.inventory_item_id,
            locationId: item.location_id,
            adjustment: item.adjustment,
          }
        })
      )

    return new StepResponse(
      adjustedLevels,
      input.map((item) => {
        return {
          ...item,
          adjustment: item.adjustment * -1,
        }
      })
    )
  },
  async (adjustedLevels, { container }) => {
    if (!adjustedLevels) {
      return
    }

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.adjustInventory(adjustedLevels)
  }
)
