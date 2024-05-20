import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateRegionDTO, IRegionModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createRegionsWorkflow } from "../../region/workflows/create-regions"

type CreateDefaultRegionStepInput = {
  region: CreateRegionDTO
}

export const createDefaultRegionStepId = "create-default-region"
export const createDefaultRegionStep = createStep(
  createDefaultRegionStepId,
  async (data: CreateDefaultRegionStepInput, { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    let shouldDelete = false
    let [region] = await service.list({}, { take: 1 })

    if (!region) {
      const { result } = await createRegionsWorkflow(container).run({
        input: { regions: [data.region] },
      })

      region = result[0]
      shouldDelete = true
    }

    return new StepResponse(region, { regionId: region.id, shouldDelete })
  },
  async (data, { container }) => {
    if (!data || !data.shouldDelete) {
      return
    }

    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    await service.delete(data.regionId)
  }
)
