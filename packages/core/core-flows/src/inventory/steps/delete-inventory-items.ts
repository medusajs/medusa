import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/utils"

export const deleteInventoryItemStepId = "delete-inventory-item-step"
export const deleteInventoryItemStep = createStep(
  deleteInventoryItemStepId,
  async (ids: string[], { container }) => {
    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.softDeleteInventoryItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevInventoryItemIds, { container }) => {
    if (!prevInventoryItemIds?.length) {
      return
    }

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.restoreInventoryItems(prevInventoryItemIds)
  }
)
