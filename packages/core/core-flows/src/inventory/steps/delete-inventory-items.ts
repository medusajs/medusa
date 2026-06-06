import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import { MathBN, MedusaError, Modules } from "@zjedene-medusa/framework/utils"
import type { BigNumberInput } from "@zjedene-medusa/framework/types"

export interface ValidateInventoryDeleteStepInput {
  inventory_items: { id: string; reserved_quantity: BigNumberInput }[]
}

export const validateVariantInventoryStepId = "validate-inventory-item-delete"

export const validateInventoryDeleteStep = createStep(
  validateVariantInventoryStepId,
  async (data: ValidateInventoryDeleteStepInput) => {
    const nonDeletable = data.inventory_items.filter((inventoryItem) => {
      return MathBN.gt(inventoryItem.reserved_quantity, 0)
    })
    if (nonDeletable.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot remove following inventory item(s) since they have reservations: [${nonDeletable
          .map((inventoryItem) => inventoryItem.id)
          .join(", ")}].`
      )
    }
  }
)

/**
 * The IDs of the inventory items to delete.
 */
export type DeleteInventoryItemStepInput = string[]

export const deleteInventoryItemStepId = "delete-inventory-item-step"
/**
 * This step deletes one or more inventory items.
 */
export const deleteInventoryItemStep = createStep(
  deleteInventoryItemStepId,
  async (ids: DeleteInventoryItemStepInput, { container }) => {
    const inventoryService = container.resolve(Modules.INVENTORY)

    await inventoryService.softDeleteInventoryItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevInventoryItemIds, { container }) => {
    if (!prevInventoryItemIds?.length) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)

    await inventoryService.restoreInventoryItems(prevInventoryItemIds)
  }
)
