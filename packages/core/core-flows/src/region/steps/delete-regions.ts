import { IRegionModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteRegionsStepId = "delete-regions"
/**
 * This step deletes one or more regions.
 */
export const deleteRegionsStep = createStep(
  deleteRegionsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    await service.softDeleteRegions(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    await service.restoreRegions(prevIds)
  }
)
