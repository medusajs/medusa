import {
  IRegionModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const findOneOrAnyRegionStepId = "find-one-or-any-region"
/**
 * This step retrieves a region either by the provided ID or the first region in the first store.
 */
export const findOneOrAnyRegionStep = createStep(
  findOneOrAnyRegionStepId,
  async (data: { regionId?: string }, { container }) => {
    const service = container.resolve<IRegionModuleService>(Modules.REGION)

    const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)

    if (data.regionId) {
      try {
        const region = await service.retrieveRegion(data.regionId, {
          relations: ["countries"],
        })
        return new StepResponse(region)
      } catch (error) {
        return new StepResponse(null)
      }
    }

    const [store] = await storeModule.listStores()

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store not found")
    }

    const [region] = await service.listRegions(
      {
        id: store.default_region_id,
      },
      { relations: ["countries"] }
    )

    if (!region) {
      return new StepResponse(null)
    }

    return new StepResponse(region)
  }
)
