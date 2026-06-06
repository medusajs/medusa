import {
  CreateRegionDTO,
  IRegionModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createRegionsStepId = "create-regions"
/**
 * This step creates one or more regions.
 * 
 * @example
 * const data = createRegionsStep([
 *   {
 *     currency_code: "usd",
 *     name: "United States",
 *     countries: ["us"],
 *   }
 * ])
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
