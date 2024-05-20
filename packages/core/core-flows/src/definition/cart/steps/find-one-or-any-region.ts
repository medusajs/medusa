import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService, IStoreModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const findOneOrAnyRegionStepId = "find-one-or-any-region"
export const findOneOrAnyRegionStep = createStep(
  findOneOrAnyRegionStepId,
  async (data: { regionId?: string }, { container }) => {
    const service = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    const storeModule = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    if (!data.regionId) {
      const [store] = await storeModule.list()

      if (!store) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store not found")
      }

      const [region] = await service.list({
        id: store.default_region_id,
      })

      if (!region) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No regions found"
        )
      }

      return new StepResponse(region)
    }

    const region = await service.retrieve(data.regionId)

    return new StepResponse(region)
  }
)
