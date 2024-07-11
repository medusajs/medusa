import { IStoreModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteStoresStepId = "delete-stores"
export const deleteStoresStep = createStep(
  deleteStoresStepId,
  async (ids: string[], { container }) => {
    const storeModule = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    await storeModule.softDeleteStores(ids)
    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const storeModule = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    await storeModule.restoreStores(idsToRestore)
  }
)
