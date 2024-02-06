import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteRegionsStepId = "delete-regions"
export const deleteRegionsStep = createStep(
  deleteRegionsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.softDelete(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.restore(prevIds)
  }
)
