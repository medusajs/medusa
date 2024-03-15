import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const deleteInventoryItemStepId = "delete-inventory-item-step"
export const deleteInventoryItemStep = createStep(
  deleteInventoryItemStepId,
  async (ids: string[], { container }) => {
    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.softDelete(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevInventoryItemIds, { container }) => {
    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.restore(prevInventoryItemIds)
  }
)
