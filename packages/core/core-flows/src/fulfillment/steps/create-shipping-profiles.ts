import {
  CreateShippingProfileDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = CreateShippingProfileDTO[]

export const createShippingProfilesStepId = "create-shipping-profiles"
export const createShippingProfilesStep = createStep(
  createShippingProfilesStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
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
      ModuleRegistrationName.FULFILLMENT
    )

    await service.deleteShippingProfiles(createdShippingProfiles)
  }
)
