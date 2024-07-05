import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateRegionDTO, IRegionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createRegionsStepId = "create-regions"
export const createRegionsStep = createStep(
  createRegionsStepId,
  async (data: CreateRegionDTO[], { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    const created = await service.create(data)

    return new StepResponse(
      created,
      created.map((region) => region.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.delete(createdIds)
  }
)
