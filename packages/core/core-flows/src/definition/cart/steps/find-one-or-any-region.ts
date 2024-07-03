import { IRegionModuleService, IStoreModuleService } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
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

    if (data.regionId) {
      try {
        const region = await service.retrieveRegion(data.regionId)
        return new StepResponse(region)
      } catch (error) {
        return new StepResponse(null)
      }
    }

    const [store] = await storeModule.listStores()

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store not found")
    }

    const [region] = await service.listRegions({
      id: store.default_region_id,
    })

    if (!region) {
      return new StepResponse(null)
    }

    return new StepResponse(region)
  }
)
