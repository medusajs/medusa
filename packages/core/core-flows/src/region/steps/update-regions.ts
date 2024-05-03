import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableRegionProps,
  IRegionModuleService,
  UpdateRegionDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateRegionsStepInput = {
  selector: FilterableRegionProps
  update: UpdateRegionDTO
}

export const updateRegionsStepId = "update-region"
export const updateRegionsStep = createStep(
  updateRegionsStepId,
  async (data: UpdateRegionsStepInput, { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.list(data.selector, {
      select: selects,
      relations,
    })

    if (Object.keys(data.update).length === 0) {
      return new StepResponse(prevData, [])
    }

    const regions = await service.update(data.selector, data.update)

    return new StepResponse(regions, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.upsert(
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
