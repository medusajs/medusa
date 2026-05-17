import { IStoreInventoryModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteStoreInventoryStep = createStep(
  "delete-store-inventory",
  async (input: { id: string }, { container }) => {
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    const storeInventory = await storeInventoryModule.retrieveStoreInventory(
      input.id
    )
    await storeInventoryModule.deleteStoreInventories(input.id)
    return new StepResponse(void 0, storeInventory)
  },
  async (storeInventory, { container }) => {
    if (!storeInventory) return
    const storeInventoryModule = container.resolve<IStoreInventoryModuleService>(
      Modules.STORE_INVENTORY
    )
    await storeInventoryModule.createStoreInventories(storeInventory)
  }
)
