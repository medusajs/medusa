import type { InventoryTypes } from "@zjedene-medusa/framework/types"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { MathBN, Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to adjust the inventory levels.
 */
export type AdjustInventoryLevelsStepInput =
  InventoryTypes.BulkAdjustInventoryLevelInput[]

export const adjustInventoryLevelsStepId = "adjust-inventory-levels-step"
/**
 * This step adjusts the stocked quantity of one or more inventory levels. You can
 * pass a positive value in `adjustment` to add to the stocked quantity, or a negative value to
 * subtract from the stocked quantity.
 *
 * @example
 * const data = adjustInventoryLevelsStep([
 *   {
 *     inventory_item_id: "iitem_123",
 *     location_id: "sloc_123",
 *     adjustment: 10,
 *   }
 * ])
 */
export const adjustInventoryLevelsStep = createStep(
  adjustInventoryLevelsStepId,
  async (input: AdjustInventoryLevelsStepInput, { container }) => {
    const inventoryService = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)
    const inventoryItemIds = input.map((item) => item.inventory_item_id)

    const lockingKeys = Array.from(new Set(inventoryItemIds))

    const adjustedLevels: InventoryTypes.InventoryLevelDTO[] =
      await locking.execute(lockingKeys, async () => {
        return await inventoryService.adjustInventory(
          input.map((item) => {
            return {
              inventoryItemId: item.inventory_item_id,
              locationId: item.location_id,
              adjustment: item.adjustment,
            }
          })
        )
      })

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
    if (!adjustedLevels?.length) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)
    const locking = container.resolve(Modules.LOCKING)
    const inventoryItemIds = adjustedLevels.map(
      (item) => item.inventory_item_id
    )

    const lockingKeys = Array.from(new Set(inventoryItemIds))

    /**
     * @todo
     * The method "adjustInventory" was broken, it was receiving the
     * "inventoryItemId" and "locationId" as snake case, whereas
     * the expected object needed these properties as camelCase
     */
    await locking.execute(lockingKeys, async () => {
      await inventoryService.adjustInventory(
        adjustedLevels.map((level) => {
          return {
            inventoryItemId: level.inventory_item_id,
            locationId: level.location_id,
            adjustment: level.adjustment,
          }
        })
      )
    })
  }
)
