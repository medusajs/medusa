import {
  FilterableShippingProfileProps,
  IFulfillmentModuleService,
  UpdateShippingProfileDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateShippingProfilesStepInput = {
  update: UpdateShippingProfileDTO
  selector: FilterableShippingProfileProps
}

export const updateShippingProfilesStepId = "update-shipping-profiles"
/**
 * This step updates shipping profiles matching the specified filters.
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
