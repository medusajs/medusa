import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableShippingProfileProps,
  IFulfillmentModuleService,
  UpdateShippingProfileDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  update: UpdateShippingProfileDTO
  selector: FilterableShippingProfileProps
}

export const updateShippingProfilesStepId = "update-shipping-profiles"
export const updateShippingProfilesStep = createStep(
  updateShippingProfilesStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
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
      ModuleRegistrationName.FULFILLMENT
    )

    await service.upsertShippingProfiles(prevData)
  }
)
