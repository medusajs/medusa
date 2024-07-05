import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const findOneOrAnyRegionStepId = "find-one-or-any-region"
export const findOneOrAnyRegionStep = createStep(
  findOneOrAnyRegionStepId,
  async (data: { regionId?: string }, { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    if (!data.regionId) {
      const regions = await service.list({})

      if (!regions?.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No regions found"
        )
      }

      return new StepResponse(regions[0])
    }

    const region = await service.retrieve(data.regionId)

    return new StepResponse(region)
  }
)
