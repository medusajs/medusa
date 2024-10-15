import {
  CreateRegionDTO,
  IRegionModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createRegionsStepId = "create-regions"
/**
 * This step creates one or more regions.
 */
export const createRegionsStep = createStep(
  createRegionsStepId,
  async (data: CreateRegionDTO[], { container }) => {
    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    const created = await service.createRegions(data)

    return new StepResponse(
      created,
      created.map((region) => region.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    await service.deleteRegions(createdIds)
  }
)
