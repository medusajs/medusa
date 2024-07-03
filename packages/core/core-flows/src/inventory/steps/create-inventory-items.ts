import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { IInventoryService, InventoryTypes } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export const createInventoryItemsStepId = "create-inventory-items"
export const createInventoryItemsStep = createStep(
  createInventoryItemsStepId,
  async (data: InventoryTypes.CreateInventoryItemInput[], { container }) => {
    const inventoryService: IInventoryService = container.resolve(
      ModuleRegistrationName.INVENTORY
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

    const inventoryService = container.resolve(ModuleRegistrationName.INVENTORY)

    await inventoryService.deleteInventoryItems(data)
  }
)
