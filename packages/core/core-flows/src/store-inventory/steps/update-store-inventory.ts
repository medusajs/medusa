import { IStoreInventoryModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateStoreInventoryStep = createStep(
  "update-store-inventory",
  async (
    input: { id: string; [key: string]: unknown },
    { container }
  ) => {
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    const storeInventory = await storeInventoryModule.updateStoreInventories(
      input.id,
      input
    )
    return new StepResponse(storeInventory, storeInventory)
  },
  async (originalStoreInventory, { container }) => {
    if (!originalStoreInventory) return
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    await storeInventoryModule.updateStoreInventories(
      originalStoreInventory.id,
      originalStoreInventory
    )
  }
)
