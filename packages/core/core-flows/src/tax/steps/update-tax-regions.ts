import {
  ITaxModuleService,
  UpdateTaxRegionDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  removeUndefined,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateTaxRegionsStepId = "update-tax-regions"
/**
 * This step updates tax regions
 */
export const updateTaxRegionsStep = createStep(
  updateTaxRegionsStepId,
  async (data: UpdateTaxRegionDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)

    const prevData = await service.listTaxRegions(
      { id: data.map((d) => d.id) },
      {
        select: selects,
        relations,
      }
    )

    const updateData = removeUndefined(
      data.map((d) => ({
        id: d.id,
        province_code: d.province_code,
        metadata: d.metadata,
      }))
    )

    const taxRegions = await service.updateTaxRegions(updateData)

    return new StepResponse(taxRegions, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)
    const updateData = removeUndefined(
      prevData.map((d) => ({
        id: d.id,
        province_code: d.province_code,
        metadata: d.metadata,
      }))
    )

    await service.updateTaxRegions(updateData)
  }
)
