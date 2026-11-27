import {
  FilterableRegionProps,
  IRegionModuleService,
  UpdateRegionDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  removeUndefined,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update regions.
 */
export type UpdateRegionsStepInput = {
  /**
   * The filters to select the regions to update.
   */
  selector: FilterableRegionProps
  /**
   * The data to update in the regions.
   */
  update: UpdateRegionDTO
}

export const updateRegionsStepId = "update-region"
/**
 * This step updates regions matching the specified filters.
 * 
 * @example
 * const data = updateRegionsStep({
 *   selector: {
 *     id: "reg_123"
 *   },
 *   update: {
 *     name: "United States"
 *   }
 * })
 */
export const updateRegionsStep = createStep(
  updateRegionsStepId,
  async (data: UpdateRegionsStepInput, { container }) => {
    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data.update],
      {
        objectFields: ["metadata"],
        requiredFields: ["id", "name", "currency_code", "metadata"],
      }
    )

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
      prevData.map((r) =>
        removeUndefined({
          id: r.id,
          name: r.name,
          currency_code: r.currency_code,
          metadata: r.metadata,
          countries: r.countries?.map((c) => c.iso_2),
        })
      )
    )
  }
)
