import { IStoreModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteStoresStepId = "delete-stores"
/**
 * This step deletes one or more stores.
 */
export const deleteStoresStep = createStep(
  deleteStoresStepId,
  async (ids: string[], { container }) => {
    const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)

    await storeModule.softDeleteStores(ids)
    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)

    await storeModule.restoreStores(idsToRestore)
  }
)
