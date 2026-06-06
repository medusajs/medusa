import {
  FilterableShippingProfileProps,
  IFulfillmentModuleService,
  UpdateShippingProfileDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update a shipping profile.
 */
export type UpdateShippingProfilesStepInput = {
  /**
   * The data to update in the shipping profiles.
   */
  update: UpdateShippingProfileDTO
  /**
   * The filters to select the shipping profiles to update.
   */
  selector: FilterableShippingProfileProps
}

export const updateShippingProfilesStepId = "update-shipping-profiles"
/**
 * This step updates shipping profiles matching the specified filters.
 * 
 * @example
 * const data = updateShippingProfilesStep({
 *   selector: {
 *     id: "sp_123"
 *   },
 *   update: {
 *     name: "Standard"
 *   }
 * })
 */
export const updateShippingProfilesStep = createStep(
  updateShippingProfilesStepId,
  async (input: UpdateShippingProfilesStepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      input.update,
    ])

    const prevData = await service.listShippingProfiles(input.selector, {
      select: selects,
      relations,
    })

    const profiles = await service.updateShippingProfiles(
      input.selector,
      input.update
    )

    return new StepResponse(profiles, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.upsertShippingProfiles(prevData)
  }
)
