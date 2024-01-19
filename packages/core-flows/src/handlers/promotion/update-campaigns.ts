import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdateCampaignDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateCampaignsStep = createStep(
  "update-campaigns",
  async (data: UpdateCampaignDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    const updatedCampaigns = await promotionModule.updateCampaigns(data)

    return new StepResponse(
      updatedCampaigns,
      updatedCampaigns.map((updatedCampaigns) => updatedCampaigns.id)
    )
  },
  async (updatedCampaignIds, { container }) => {
    if (!updatedCampaignIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      ModuleRegistrationName.PROMOTION
    )

    await promotionModule.delete(updatedCampaignIds)
  }
)
