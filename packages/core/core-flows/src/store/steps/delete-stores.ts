import type { IStoreModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the stores to delete.
 */
export type DeleteStoresStepInput = string[]

export const deleteStoresStepId = "delete-stores"
/**
 * This step deletes one or more stores.
 */
export const deleteStoresStep = createStep(
  deleteStoresStepId,
  async (ids: DeleteStoresStepInput, { container }) => {
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
