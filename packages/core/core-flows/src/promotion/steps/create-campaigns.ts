import { CreateCampaignDTO, IPromotionModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createCampaignsStepId = "create-campaigns"
/**
 * This step cancels one or more campaigns.
 */
export const createCampaignsStep = createStep(
  createCampaignsStepId,
  async (data: CreateCampaignDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const createdCampaigns = await promotionModule.createCampaigns(data)

    return new StepResponse(
      createdCampaigns,
      createdCampaigns.map((createdCampaigns) => createdCampaigns.id)
    )
  },
  async (createdCampaignIds, { container }) => {
    if (!createdCampaignIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.deleteCampaigns(createdCampaignIds)
  }
)
