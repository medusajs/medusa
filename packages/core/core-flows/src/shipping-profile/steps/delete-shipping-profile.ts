import { IFulfillmentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteShippingProfilesStepId = "delete-shipping-profile"
export const deleteShippingProfilesStep = createStep(
  deleteShippingProfilesStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.softDeleteShippingProfiles(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.restoreShippingProfiles(prevIds)
  }
)
