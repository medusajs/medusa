import {
  CreateShippingProfileDTO,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createShippingProfilesStepId = "create-shipping-profiles"
/**
 * This step creates one or more shipping profiles.
 */
export const createShippingProfilesStep = createStep(
  createShippingProfilesStepId,
  async (input: CreateShippingProfileDTO[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const createdShippingProfiles = await service.createShippingProfiles(input)

    return new StepResponse(
      createdShippingProfiles,
      createdShippingProfiles.map((created) => created.id)
    )
  },
  async (createdShippingProfiles, { container }) => {
    if (!createdShippingProfiles?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.deleteShippingProfiles(createdShippingProfiles)
  }
)
