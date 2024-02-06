import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableRegionProps,
  IRegionModuleService,
  UpdatableRegionFields,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateRegionsStepInput = {
  selector: FilterableRegionProps
  update: UpdatableRegionFields
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

    await promiseAll(
      prevData.map(
        async (region) =>
          await service.update(region.id, {
            name: region.name,
            currency_code: region.currency_code,
            metadata: region.metadata,
          })
      )
    )
  }
)
