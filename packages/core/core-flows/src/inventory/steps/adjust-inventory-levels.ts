import { IInventoryService, InventoryTypes } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { MathBN, Modules } from "@medusajs/framework/utils"

export const adjustInventoryLevelsStepId = "adjust-inventory-levels-step"
/**
 * This step adjusts one or more inventory levels.
 */
export const adjustInventoryLevelsStep = createStep(
  adjustInventoryLevelsStepId,
  async (
    input: InventoryTypes.BulkAdjustInventoryLevelInput[],
    { container }
  ) => {
    const inventoryService: IInventoryService = container.resolve(
      Modules.INVENTORY
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
          adjustment: MathBN.mult(item.adjustment, -1),
        }
      })
    )
  },
  async (adjustedLevels, { container }) => {
    if (!adjustedLevels) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)

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
