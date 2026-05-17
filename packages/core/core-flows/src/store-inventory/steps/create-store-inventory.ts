import { IStoreInventoryModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createStoreInventoryStep = createStep(
  "create-store-inventory",
  async (
    input: {
      location_id: string
      material_id: string
      [key: string]: unknown
    },
    { container }
  ) => {
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    const storeInventory = await storeInventoryModule.createStoreInventories(
      input
    )
    return new StepResponse(storeInventory, storeInventory.id)
  },
  async (storeInventoryId, { container }) => {
    if (!storeInventoryId) return
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    await storeInventoryModule.deleteStoreInventories(storeInventoryId)
  }
)
