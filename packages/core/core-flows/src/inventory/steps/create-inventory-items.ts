import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { IInventoryService, InventoryTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const createInventoryItemsStepId = "create-inventory-items"
/**
 * This step creates one or more inventory items.
 */
export const createInventoryItemsStep = createStep(
  createInventoryItemsStepId,
  async (data: InventoryTypes.CreateInventoryItemInput[], { container }) => {
    const inventoryService: IInventoryService = container.resolve(
      Modules.INVENTORY
    )

    const createdItems: InventoryTypes.InventoryItemDTO[] =
      await inventoryService.createInventoryItems(data)

    return new StepResponse(
      createdItems,
      createdItems.map((i) => i.id)
    )
  },
  async (data: string[] | undefined, { container }) => {
    if (!data?.length) {
      return
    }

    const inventoryService = container.resolve(Modules.INVENTORY)

    await inventoryService.deleteInventoryItems(data)
  }
)
