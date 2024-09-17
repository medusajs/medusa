import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteCollectionsStepId = "delete-collections"
/**
 * This step deletes one or more collections.
 */
export const deleteCollectionsStep = createStep(
  deleteCollectionsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductCollections(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductCollections(prevIds)
  }
)
