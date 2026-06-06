import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

import type {
  IInventoryService,
  InventoryTypes,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to create the inventory items.
 */
export type CreateInventoryItemsStepInput =
  InventoryTypes.CreateInventoryItemInput[]

export const createInventoryItemsStepId = "create-inventory-items"
/**
 * This step creates one or more inventory items.
 */
export const createInventoryItemsStep = createStep(
  createInventoryItemsStepId,
  async (data: CreateInventoryItemsStepInput, { container }) => {
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
