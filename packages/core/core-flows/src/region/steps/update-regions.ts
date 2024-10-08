import {
  FilterableRegionProps,
  IRegionModuleService,
  UpdateRegionDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateRegionsStepInput = {
  selector: FilterableRegionProps
  update: UpdateRegionDTO
}

export const updateRegionsStepId = "update-region"
/**
 * This step updates regions matching the specified filters.
 */
export const updateRegionsStep = createStep(
  updateRegionsStepId,
  async (data: UpdateRegionsStepInput, { container }) => {
    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listRegions(data.selector, {
      select: selects,
      relations,
    })

    if (Object.keys(data.update).length === 0) {
      return new StepResponse(prevData, [])
    }

    const regions = await service.updateRegions(data.selector, data.update)

    return new StepResponse(regions, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    await service.upsertRegions(
      prevData.map((r) => ({
        id: r.id,
        name: r.name,
        currency_code: r.currency_code,
        metadata: r.metadata,
        countries: r.countries?.map((c) => c.iso_2),
      }))
    )
  }
)
