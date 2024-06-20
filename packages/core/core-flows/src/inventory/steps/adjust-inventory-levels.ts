import { IInventoryService, InventoryTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const adjustInventoryLevelsStepId = "adjust-inventory-levels-step"
export const adjustInventoryLevelsStep = createStep(
  adjustInventoryLevelsStepId,
  async (
    input: InventoryTypes.BulkAdjustInventoryLevelInput[],
    { container }
  ) => {
    const inventoryService: IInventoryService = container.resolve(
      ModuleRegistrationName.INVENTORY
    )

    const adjustedLevels: InventoryTypes.InventoryLevelDTO[] =
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

    /**
     * @todo
     * The method "adjustInventory" was broken, it was receiving the
     * "inventoryItemId" and "locationId" as snake case, whereas
     * the expected object needed these properties as camelCase
     */
    await inventoryService.adjustInventory(
      adjustedLevels.map((level) => {
        return {
          inventoryItemId: level.inventory_item_id,
          locationId: level.location_id,
          adjustment: level.adjustment,
        }
      })
    )
  }
)
